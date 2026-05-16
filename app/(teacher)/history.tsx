import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Animated, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Skeleton loading component with shimmer effect
const SkeletonBox = ({ width, height, style }: { width: number | string; height: number; style?: any }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E0E0E0',
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton card for session
const SkeletonSessionCard = () => (
  <View style={styles.sessionCard}>
    <View style={styles.sessionHeader}>
      <View style={styles.sessionInfo}>
        <SkeletonBox width="70%" height={18} style={{ marginBottom: 8 }} />
        <SkeletonBox width="50%" height={14} style={{ marginBottom: 6 }} />
        <SkeletonBox width="40%" height={13} />
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.attendanceStat}>
          <SkeletonBox width={40} height={20} style={{ marginBottom: 4 }} />
          <SkeletonBox width={50} height={11} />
        </View>
        <SkeletonBox width={45} height={26} style={{ borderRadius: 12 }} />
        <SkeletonBox width={24} height={24} style={{ borderRadius: 12 }} />
      </View>
    </View>
  </View>
);

// Full skeleton loader
const SkeletonLoader = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Ιστορικό Παρουσιών</Text>
    </View>
    <ScrollView style={styles.scrollView}>
      <SkeletonSessionCard />
      <SkeletonSessionCard />
      <SkeletonSessionCard />
      <SkeletonSessionCard />
    </ScrollView>
  </View>
);

// Animated session card with drop-in effect
interface AnimatedSessionCardProps {
  session: SessionWithAttendance;
  animationIndex: number; // Index relative to the batch (0, 1, 2... for each load)
  isExpanded: boolean;
  onToggle: () => void;
  formatDate: (date: string) => string;
  getAttendancePercentage: (attended: number, enrolled: number) => number;
}

const AnimatedSessionCard = ({
  session,
  animationIndex,
  isExpanded,
  onToggle,
  formatDate,
  getAttendancePercentage,
}: AnimatedSessionCardProps) => {
  const dropAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Only animate once
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const delay = animationIndex * 100; // Stagger each card by 100ms

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(dropAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const percentage = getAttendancePercentage(session.attendance.length, session.enrolledCount);

  return (
    <Animated.View
      style={[
        styles.sessionCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: dropAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.sessionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sessionInfo}>
          <Text style={styles.courseName}>{session.courses.course_name}</Text>
          <Text style={styles.sessionDate}>{formatDate(session.session_date)}</Text>
          <Text style={styles.sessionTime}>
            {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)} | {session.room_number}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.attendanceStat}>
            <Text style={styles.attendanceCount}>
              {session.attendance.length}/{session.enrolledCount}
            </Text>
            <Text style={styles.attendanceLabel}>παρόντες</Text>
          </View>
          <View style={[
            styles.percentageBadge,
            {
              backgroundColor: percentage >= 70
                ? '#4CAF50'
                : percentage >= 50
                ? '#FFC107'
                : '#FF5722'
            }
          ]}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.attendanceList}>
          {session.attendance.length === 0 ? (
            <Text style={styles.noAttendance}>Δεν υπάρχουν καταγεγραμμένες παρουσίες</Text>
          ) : (
            session.attendance.map((record, idx) => (
              <View key={record.id} style={styles.attendanceItem}>
                <View style={styles.attendanceNumber}>
                  <Text style={styles.numberText}>{idx + 1}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>
                    {record.student.first_name} {record.student.last_name}
                  </Text>
                  <Text style={styles.studentUsername}>@{record.student_username}</Text>
                </View>
                <Text style={styles.attendanceTime}>
                  {new Date(record.created_at).toLocaleTimeString('el-GR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </Animated.View>
  );
};

interface AttendanceRecord {
  id: string;
  student_username: string;
  created_at: string;
  student: {
    first_name: string;
    last_name: string;
    username: string;
  };
}

interface SessionWithAttendance {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  room_number: string;
  status: string;
  courses: {
    course_name: string;
    course_code: string;
  };
  attendance: AttendanceRecord[];
  enrolledCount: number;
}

const PAGE_SIZE = 10;

export default function AttendanceHistory() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const [sessions, setSessions] = useState<SessionWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(sessionId || null);
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [animatedSessions, setAnimatedSessions] = useState<Set<string>>(new Set());
  const lastBatchStartIndex = useRef(0);

  const fetchHistory = async (offset: number = 0, append: boolean = false) => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      // Only fetch courses on initial load
      let currentCourseIds = courseIds;
      if (!append || courseIds.length === 0) {
        const { data: teacherCourses, error: coursesError } = await supabase
          .from('courses')
          .select('id')
          .eq('teacher_id', userId);

        if (coursesError || !teacherCourses) return;

        currentCourseIds = teacherCourses.map(c => c.id);
        setCourseIds(currentCourseIds);
      }

      if (currentCourseIds.length === 0) return;

      // Fetch completed sessions with attendance
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
            course_name,
            course_code
          )
        `)
        .in('course_id', currentCourseIds)
        .in('status', ['completed', 'active'])
        .order('session_date', { ascending: false })
        .order('start_time', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (sessionsError || !sessionsData) return;

      // Fetch attendance for each session
      const sessionsWithAttendance: SessionWithAttendance[] = await Promise.all(
        sessionsData.map(async (session) => {
          // Get attendance records
          const { data: attendance, error: attendanceError } = await supabase
            .from('attendance')
            .select('id, student_username, created_at')
            .eq('class_session_id', session.id)
            .order('created_at');

          if (attendanceError) {
            console.error('Attendance fetch error:', attendanceError);
          }

          // Get student details
          let attendanceWithStudents: AttendanceRecord[] = [];
          if (attendance && attendance.length > 0) {
            const studentUsernames = attendance.map(a => a.student_username);
            const { data: students } = await supabase
              .from('users')
              .select('username, first_name, last_name')
              .in('username', studentUsernames);

            attendanceWithStudents = attendance.map(a => ({
              id: a.id,
              student_username: a.student_username,
              created_at: a.created_at,
              student: students?.find(s => s.username === a.student_username) || {
                first_name: 'Άγνωστος',
                last_name: '',
                username: a.student_username,
              },
            }));
          }

          // Get enrolled student count for this course
          const { count: enrolledCount } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', session.course_id);

          return {
            ...session,
            attendance: attendanceWithStudents,
            enrolledCount: enrolledCount || 0,
          };
        })
      );

      // Check if we have more data to load
      setHasMore(sessionsData.length === PAGE_SIZE);

      if (append) {
        // Track the start index for the new batch
        lastBatchStartIndex.current = sessions.length;
        setSessions(prev => [...prev, ...sessionsWithAttendance]);
      } else {
        // Reset for fresh load
        lastBatchStartIndex.current = 0;
        setAnimatedSessions(new Set());
        setSessions(sessionsWithAttendance);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchHistory(sessions.length, true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    // Clear sessions to show skeleton
    setSessions([]);
    setLoading(true);
    await fetchHistory(0, false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHistory(0, false);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('el-GR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const getAttendancePercentage = (attended: number, enrolled: number) => {
    if (enrolled === 0) return 0;
    return Math.round((attended / enrolled) * 100);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loadingMore && hasMore && sessions.length > 0) {
      loadMore();
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ιστορικό Παρουσιών</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>Δεν υπάρχει ιστορικό παρουσιών</Text>
          </View>
        ) : (
          <>
            {sessions.map((session, index) => {
              // Calculate animation index relative to the batch
              const animationIndex = index >= lastBatchStartIndex.current
                ? index - lastBatchStartIndex.current
                : 0;

              return (
                <AnimatedSessionCard
                  key={session.id}
                  session={session}
                  animationIndex={animationIndex}
                  isExpanded={expandedSession === session.id}
                  onToggle={() => setExpandedSession(
                    expandedSession === session.id ? null : session.id
                  )}
                  formatDate={formatDate}
                  getAttendancePercentage={getAttendancePercentage}
                />
              );
            })}
            {loadingMore && (
              <>
                <SkeletonSessionCard />
                <SkeletonSessionCard />
              </>
            )}
            {!hasMore && sessions.length > 0 && (
              <View style={styles.endOfList}>
                <Text style={styles.endOfListText}>Δεν υπάρχουν άλλες εγγραφές</Text>
              </View>
            )}
          </>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 15,
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
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sessionTime: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  attendanceStat: {
    alignItems: 'center',
  },
  attendanceCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  attendanceLabel: {
    fontSize: 11,
    color: '#666',
  },
  percentageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  percentageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  attendanceList: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  noAttendance: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  attendanceNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  studentUsername: {
    fontSize: 13,
    color: '#999',
  },
  attendanceTime: {
    fontSize: 14,
    color: '#666',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingMoreText: {
    color: '#666',
    fontSize: 14,
  },
  endOfList: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  endOfListText: {
    color: '#999',
    fontSize: 14,
  },
});
