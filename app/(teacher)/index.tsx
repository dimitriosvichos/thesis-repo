import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClassSession {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room_number: string;
  status: 'pending' | 'active' | 'completed';
  course_id: string;
  courses: {
    course_code: string;
    course_name: string;
  };
}

export default function TeacherDashboard() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [activeSession, setActiveSession] = useState<ClassSession | null>(null);

  const fetchTeacherData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        router.replace('/(auth)/login');
        return;
      }

      // Fetch teacher details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setTeacherName(`${userData.first_name} ${userData.last_name}`);

      // Fetch teacher's courses and sessions
      const { data: teacherCourses, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('teacher_id', userId);

      if (coursesError) throw coursesError;

      if (!teacherCourses || teacherCourses.length === 0) {
        setSessions([]);
        return;
      }

      const courseIds = teacherCourses.map(c => c.id);
      const todayDate = new Date().toISOString().split('T')[0];

      // Fetch class sessions for today and upcoming
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('class_sessions')
        .select(`
          id,
          session_date,
          start_time,
          end_time,
          room_number,
          status,
          course_id,
          courses (
            course_code,
            course_name
          )
        `)
        .in('course_id', courseIds)
        .gte('session_date', todayDate)
        .order('session_date')
        .order('start_time')
        .limit(20);

      if (sessionsError) throw sessionsError;

      setSessions(sessionsData || []);

      // Find active session
      const active = sessionsData?.find(s => s.status === 'active');
      setActiveSession(active || null);

      // Store active session ID for the scanner
      if (active) {
        await AsyncStorage.setItem('activeSessionId', active.id);
      } else {
        await AsyncStorage.removeItem('activeSessionId');
      }

    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  const handleStartSession = async (session: ClassSession) => {
    try {
      // Check if there's already an active session
      if (activeSession && activeSession.id !== session.id) {
        Alert.alert(
          'Υπάρχει ενεργό μάθημα',
          'Πρέπει πρώτα να τερματίσετε το τρέχον μάθημα.',
          [{ text: 'OK' }]
        );
        return;
      }

      const { error } = await supabase
        .from('class_sessions')
        .update({ status: 'active' })
        .eq('id', session.id);

      if (error) throw error;

      await AsyncStorage.setItem('activeSessionId', session.id);

      Alert.alert('Επιτυχία', 'Το μάθημα ξεκίνησε! Μπορείτε τώρα να σαρώσετε τους φοιτητές.');
      fetchTeacherData();
    } catch (error) {
      console.error('Error starting session:', error);
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η έναρξη του μαθήματος.');
    }
  };

  const handleEndSession = async (session: ClassSession) => {
    Alert.alert(
      'Τερματισμός Μαθήματος',
      'Είστε σίγουροι ότι θέλετε να τερματίσετε το μάθημα;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Τερματισμός',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('class_sessions')
                .update({ status: 'completed' })
                .eq('id', session.id);

              if (error) throw error;

              await AsyncStorage.removeItem('activeSessionId');

              Alert.alert('Επιτυχία', 'Το μάθημα ολοκληρώθηκε.');
              fetchTeacherData();
            } catch (error) {
              console.error('Error ending session:', error);
              Alert.alert('Σφάλμα', 'Δεν ήταν δυνατός ο τερματισμός του μαθήματος.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('activeSessionId');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeacherData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'completed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Σε εξέλιξη';
      case 'pending': return 'Προγραμματισμένο';
      case 'completed': return 'Ολοκληρωμένο';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Σήμερα';
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'Αύριο';
    }
    return date.toLocaleDateString('el-GR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Καλημέρα</Text>
            <Text style={styles.teacherName}>{teacherName}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {activeSession && (
          <View style={styles.activeSessionBanner}>
            <Ionicons name="radio-button-on" size={16} color="#4CAF50" />
            <Text style={styles.activeSessionText}>
              Ενεργό: {activeSession.courses.course_name}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Τα μαθήματά σας</Text>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>Δεν υπάρχουν προγραμματισμένα μαθήματα</Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.courseName}>{session.courses.course_name}</Text>
                  <Text style={styles.courseCode}>{session.courses.course_code}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(session.status)}</Text>
                </View>
              </View>

              <View style={styles.sessionDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{formatDate(session.session_date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{session.room_number}</Text>
                </View>
              </View>

              <View style={styles.sessionActions}>
                {session.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.startButton]}
                    onPress={() => handleStartSession(session)}
                  >
                    <Ionicons name="play" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Έναρξη</Text>
                  </TouchableOpacity>
                )}

                {session.status === 'active' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.scanButton]}
                      onPress={() => router.push('/(teacher)/scan')}
                    >
                      <Ionicons name="scan" size={18} color="white" />
                      <Text style={styles.actionButtonText}>Σάρωση</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.endButton]}
                      onPress={() => handleEndSession(session)}
                    >
                      <Ionicons name="stop" size={18} color="white" />
                      <Text style={styles.actionButtonText}>Τέλος</Text>
                    </TouchableOpacity>
                  </>
                )}

                {session.status === 'completed' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => router.push(`/(teacher)/history?sessionId=${session.id}`)}
                  >
                    <Ionicons name="list" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Προβολή</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  teacherName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 2,
    borderRadius: 40,
    borderColor: 'white',
    padding: 8,
  },
  activeSessionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  activeSessionText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  courseCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sessionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  scanButton: {
    backgroundColor: '#007AFF',
  },
  endButton: {
    backgroundColor: '#FF5722',
  },
  viewButton: {
    backgroundColor: '#666',
  },
});
