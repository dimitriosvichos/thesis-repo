import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreventScreenCapture } from 'expo-screen-capture';

export default function Home() {
  usePreventScreenCapture();

  const [userDetails, setUserDetails] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [qrValue, setQrValue] = useState('');

  const generateQRValue = (username) => {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      username: username,
      timestamp: timestamp
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('userRole');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  useEffect(() => {
    if (userDetails?.username) {

      setQrValue(generateQRValue(userDetails.username));

      const interval = setInterval(() => {
        setQrValue(generateQRValue(userDetails.username));
      }, 10 * 60 * 1000)

      return () => clearInterval(interval);
    }
  }, [userDetails]);

  const fetchUserAndClassDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Retrieved userId from AsyncStorage:', userId);

      if (!userId) {
        console.error('No userId found in AsyncStorage');
        router.replace('/(auth)/login');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('first_name, last_name, username')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user details:', userError);
        throw userError;
      }

      if (!userData) {
        console.error('No user data found for ID:', userId);
        return;
      }

      console.log('User data retrieved:', userData);
      setUserDetails(userData);
      setQrValue(userData.username);

      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select(`
          courses (
            id,
            course_code,
            course_name
          )
        `)
        .eq('student_id', userId);

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        throw enrollmentError;
      }

      if (!enrollments || enrollments.length === 0) {
        console.log('No enrollments found for user:', userId);
        setNextClass([]);
        return;
      }

      const courseIds = enrollments
        .filter(enrollment => enrollment?.courses?.id)
        .map(enrollment => enrollment.courses.id);

      console.log('Found course IDs:', courseIds);

      if (courseIds.length === 0) {
        console.log('No valid course IDs found');
        setNextClass([]);
        return;
      }

      const todayDate = new Date().toISOString().split('T')[0];
      console.log('Querying classes from date:', todayDate);

      const { data: classData, error: classError } = await supabase
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
                course_name,
                semester,
                academic_year
            )
        `)
        .in('course_id', courseIds)
        .in('status', ['pending', 'active'])
        .gte('session_date', todayDate)
        .order('session_date')
        .order('start_time')
        .limit(1);

      if (classError) {
        console.error('Error fetching class sessions:', classError);
        throw classError;
      }

      if (!classData || classData.length === 0) {
        console.log('No upcoming classes found');
        setNextClass([]);
        return;
      }

      console.log('Successfully retrieved class data:', classData);
      setNextClass(classData);

    } catch (error) {
      console.error('ERROR ama den fetchUserAndClassDetails:', error);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      if (isSubscribed) {
        await fetchUserAndClassDetails();
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Καλημέρα ☀️';
    } else if (hour >= 12 && hour < 18) {
      return 'Καλησπέρα 🌤️';
    } else {
      return 'Καληνύχτα 🌙';
    }
  };

  const formatTimeUntilClass = (sessionDate: string, startTime: string) => {
    const now = new Date();
    const classDate = new Date(`${sessionDate}T${startTime}`);
    const diffInMilliseconds = classDate.getTime() - now.getTime();

    if (diffInMilliseconds <= 0) {
      return {
        days: '',
        hours: '',
        minutes: 'Το Μάθημα ξεκίνησε'
      };
    }

    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = diffInHours % 24;
    const remainingMinutes = diffInMinutes % 60;

    if (diffInDays > 0) {
      return {
        days: `${diffInDays} ${diffInDays === 1 ? 'μέρα' : 'μέρες'}`,
        hours: remainingHours > 0 ? `${remainingHours} ${remainingHours === 1 ? 'ώρα' : 'ώρες'}` : '',
        minutes: ''
      };
    } else if (remainingHours > 0) {
      return {
        days: '',
        hours: `${remainingHours} ${remainingHours === 1 ? 'ώρα' : 'ώρες'}`,
        minutes: remainingMinutes > 0 ? `${remainingMinutes} λεπτά` : ''
      };
    } else {
      return {
        days: '',
        hours: '',
        minutes: `${remainingMinutes} λεπτά`
      };
    }
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const upcomingClass = nextClass && nextClass.length > 0 ? nextClass[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>
              {`${userDetails.first_name} ${userDetails.last_name}`}
            </Text>
          </View>

          <View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.nextClassTitle}>Επόμενο μάθημα</Text>

        <View style={styles.nextClassCard}>
          {upcomingClass ? (
            <View style={styles.classInfo}>
              <View style={styles.classDetailsLeft}>
                <Text style={styles.className}>
                  {upcomingClass.courses?.course_name}
                </Text>
                <Text style={styles.classSubInfo}>
                  {upcomingClass.start_time.slice(0, 5)} - {upcomingClass.end_time.slice(0, 5)} • {upcomingClass.room_number}
                </Text>
              </View>
              <View style={styles.timeUntilContainer}>
                {(() => {
                  const timeInfo = formatTimeUntilClass(upcomingClass.session_date, upcomingClass.start_time);
                  return (
                    <>
                      {timeInfo.days && <Text style={styles.timeUntilText}>{timeInfo.days}</Text>}
                      {timeInfo.hours && <Text style={styles.timeUntilText}>{timeInfo.hours}</Text>}
                      {timeInfo.minutes && <Text style={styles.timeUntilText}>{timeInfo.minutes}</Text>}
                    </>
                  );
                })()}
              </View>
            </View>
          ) : (
            <Text style={styles.noClassText}>Δεν υπάρχει προγραμματισμένο μάθημα</Text>
          )}
        </View>
      </View>

      <View style={styles.qrSection}>
        <Text style={styles.qrTitle}>Το QR σου:</Text>
        {qrValue && (
          <QRCode
            value={qrValue}
            size={300}
            backgroundColor='white'
            color='black'
          />
        )}
      </View>

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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 80,
    borderColor: 'white',
    padding: 8
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  greeting: {
    color: 'white',
    fontSize: 16,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  nextClassCard: {
    backgroundColor: 'white',
    padding: 15,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#DDDDDD',
  },
  nextClassTitle: {
    fontSize: 16,
    marginTop: 20,
    color: '#fff',
  },
  className: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  classTime: {
    fontSize: 14,
    color: '#666',
  },
  qrSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classDetailsLeft: {
    flex: 1,
  },
  classSubInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  timeUntilContainer: {
    alignItems: 'flex-end',
  },
  timeUntilText: {
    fontSize: 14,
    color: '#666',
  },
  noClassText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});