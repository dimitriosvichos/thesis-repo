import { View, Text, StyleSheet, Alert, TouchableOpacity, Vibration } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface ScannedStudent {
  username: string;
  firstName: string;
  lastName: string;
  timestamp: string;
}

export default function TeacherScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [scannedStudents, setScannedStudents] = useState<ScannedStudent[]>([]);
  const [lastScannedStudent, setLastScannedStudent] = useState<ScannedStudent | null>(null);

  // Reload active session every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      loadActiveSession();
    }, [])
  );

  const loadActiveSession = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('activeSessionId');
      setActiveSessionId(sessionId);

      if (sessionId) {
        // Fetch session info
        const { data: session, error } = await supabase
          .from('class_sessions')
          .select(`
            id,
            courses (
              course_name,
              course_code
            )
          `)
          .eq('id', sessionId)
          .single();

        if (!error && session) {
          setSessionInfo(session);
        }

        // Fetch already scanned students for this session
        const { data: attendance, error: attendanceError } = await supabase
          .from('attendance')
          .select('student_username, created_at')
          .eq('class_session_id', sessionId);

        if (!attendanceError && attendance) {
          // Get student details for each attendance record
          const studentUsernames = attendance.map(a => a.student_username);

          if (studentUsernames.length > 0) {
            const { data: students } = await supabase
              .from('users')
              .select('username, first_name, last_name')
              .in('username', studentUsernames);

            const scannedList = attendance.map(a => {
              const student = students?.find(s => s.username === a.student_username);
              return {
                username: a.student_username,
                firstName: student?.first_name || '',
                lastName: student?.last_name || '',
                timestamp: a.created_at,
              };
            });

            setScannedStudents(scannedList);
          }
        }
      }
    } catch (error) {
      console.error('Error loading active session:', error);
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Parse the QR code data
      let qrData;
      try {
        qrData = JSON.parse(data);
      } catch {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Σφάλμα', 'Μη έγκυρος κωδικός QR');
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      const { username, timestamp } = qrData;

      if (!username) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Σφάλμα', 'Ο κωδικός QR δεν περιέχει έγκυρα στοιχεία');
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      // Check if QR code is not too old (more than 15 minutes)
      if (timestamp) {
        const qrTime = new Date(timestamp).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - qrTime) / (1000 * 60);

        if (diffMinutes > 15) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert(
            'Ληγμένος Κωδικός',
            'Ο κωδικός QR έχει λήξει. Ζητήστε από τον φοιτητή να ανανεώσει την εφαρμογή.'
          );
          setTimeout(() => setScanned(false), 2000);
          return;
        }
      }

      // Check if there's an active session
      if (!activeSessionId) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Σφάλμα', 'Δεν υπάρχει ενεργό μάθημα. Ξεκινήστε πρώτα ένα μάθημα.');
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      // Check if student exists
      const { data: student, error: studentError } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, role')
        .eq('username', username)
        .single();

      if (studentError || !student) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Σφάλμα', 'Ο φοιτητής δεν βρέθηκε στο σύστημα');
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      if (student.role !== 'student') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Σφάλμα', 'Ο χρήστης δεν είναι φοιτητής');
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      // Check if already scanned
      const alreadyScanned = scannedStudents.some(s => s.username === username);
      if (alreadyScanned) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          'Ήδη Καταγεγραμμένος',
          `Ο/Η ${student.first_name} ${student.last_name} έχει ήδη καταγραφεί στο μάθημα.`
        );
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      // Record attendance
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          class_session_id: activeSessionId,
          student_username: username,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        // Check if it's a duplicate key error (student already scanned)
        if (insertError.code === '23505') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert(
            'Ήδη Καταγεγραμμένος',
            `Ο/Η ${student.first_name} ${student.last_name} έχει ήδη καταγραφεί στο μάθημα.`
          );
          // Update local state to include this student
          const existingStudent: ScannedStudent = {
            username: student.username,
            firstName: student.first_name,
            lastName: student.last_name,
            timestamp: new Date().toISOString(),
          };
          setScannedStudents(prev => {
            if (!prev.some(s => s.username === student.username)) {
              return [existingStudent, ...prev];
            }
            return prev;
          });
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η καταγραφή της παρουσίας');
        }
        setTimeout(() => setScanned(false), 2000);
        return;
      }

      // Success!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const newStudent: ScannedStudent = {
        username: student.username,
        firstName: student.first_name,
        lastName: student.last_name,
        timestamp: new Date().toISOString(),
      };

      setLastScannedStudent(newStudent);
      setScannedStudents(prev => [newStudent, ...prev]);

      // Auto-reset after 2 seconds
      setTimeout(() => {
        setScanned(false);
        setLastScannedStudent(null);
      }, 2000);

    } catch (error) {
      console.error('Scan error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Σφάλμα', 'Παρουσιάστηκε σφάλμα κατά τη σάρωση');
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Φόρτωση...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#666" />
        <Text style={styles.permissionText}>
          Χρειαζόμαστε πρόσβαση στην κάμερα για να σαρώσουμε τους κωδικούς QR των φοιτητών
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Παροχή Άδειας</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!activeSessionId) {
    return (
      <View style={styles.noSessionContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF5722" />
        <Text style={styles.noSessionText}>Δεν υπάρχει ενεργό μάθημα</Text>
        <Text style={styles.noSessionSubtext}>
          Πηγαίνετε στην καρτέλα "Μαθήματα" και ξεκινήστε ένα μάθημα για να σαρώσετε φοιτητές.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Σάρωση Φοιτητών</Text>
        {sessionInfo && (
          <Text style={styles.sessionName}>
            {sessionInfo.courses?.course_name}
          </Text>
        )}
        <View style={styles.countBadge}>
          <Ionicons name="people" size={16} color="white" />
          <Text style={styles.countText}>{scannedStudents.length}</Text>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Scan overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Success feedback */}
        {lastScannedStudent && (
          <View style={styles.successOverlay}>
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <Text style={styles.successName}>
                {lastScannedStudent.firstName} {lastScannedStudent.lastName}
              </Text>
              <Text style={styles.successText}>Καταγράφηκε επιτυχώς!</Text>
            </View>
          </View>
        )}
      </View>

      {/* Recently scanned list */}
      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Πρόσφατες Παρουσίες</Text>
        {scannedStudents.length === 0 ? (
          <Text style={styles.emptyText}>Δεν έχουν σαρωθεί φοιτητές ακόμα</Text>
        ) : (
          scannedStudents.slice(0, 3).map((student, index) => (
            <View key={`${student.username}-${index}`} style={styles.recentItem}>
              <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>
                  {student.firstName} {student.lastName}
                </Text>
                <Text style={styles.recentTime}>
                  {new Date(student.timestamp).toLocaleTimeString('el-GR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sessionName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    flex: 1,
    marginLeft: 10,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#007AFF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  successName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  successText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
  recentContainer: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    maxHeight: 200,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  recentName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  recentTime: {
    fontSize: 13,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 30,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noSessionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 30,
  },
  noSessionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  noSessionSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
