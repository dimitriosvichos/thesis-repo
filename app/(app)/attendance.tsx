import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Session {
    id: string;
    session_date: string;
    start_time: string;
    end_time: string;
    room_number: string;
    status: string;
    course_id: string;
    course_name: string;
    course_code: string;
    semester: string;
    academic_year: string;
}

interface GroupedSessions {
    [date: string]: Session[];
}

export default function Attendance() {
    const [sessions, setSessions] = useState<GroupedSessions>({});
    const [refreshing, setRefreshing] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const datePositions = useRef<{ [date: string]: number }>({});


    const fetchClassSessions = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;

            const { data: enrollments, error: enrollmentError } = await supabase
                .from('course_enrollments')
                .select(`
                    courses (
                        id,
                        course_code,
                        course_name,
                        semester,
                        academic_year
                    )
                `)
                .eq('student_id', userId);

            if (enrollmentError) throw enrollmentError;
            if (!enrollments || enrollments.length === 0) {
                setSessions({});
                return;
            }

            const courseIds = enrollments
                .filter(enrollment => enrollment.courses?.id)
                .map(enrollment => enrollment.courses.id);

            if (courseIds.length === 0) {
                setSessions({});
                return;
            }

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
                        course_name,
                        semester,
                        academic_year
                    )
                `)
                .in('course_id', courseIds)
                .order('session_date')
                .order('start_time');

            if (sessionsError) throw sessionsError;
            if (!sessionsData || sessionsData.length === 0) {
                setSessions({});
                return;
            }

            const groupedSessions: GroupedSessions = sessionsData.reduce((acc: GroupedSessions, session) => {
                const date = session.session_date;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push({
                    ...session,
                    course_name: session.courses?.course_name || '',
                    course_code: session.courses?.course_code || '',
                    semester: session.courses?.semester || '',
                    academic_year: session.courses?.academic_year || ''
                });
                return acc;
            }, {});

            setSessions(groupedSessions);

        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchClassSessions();
        setRefreshing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#4CAF50';
            case 'pending':
                return '#FFC107';
            case 'completed':
                return '#9E9E9E';
            default:
                return '#9E9E9E';
        }
    };

    const scrollToUpcoming = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const sortedDates = Object.keys(sessions).sort();

        // Find the first date that is today or in the future
        const upcomingDate = sortedDates.find(date => date >= today);

        if (upcomingDate && datePositions.current[upcomingDate] !== undefined) {
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: datePositions.current[upcomingDate],
                    animated: true
                });
            }, 100);
        }
    }, [sessions]);

    useEffect(() => {
        fetchClassSessions();
    }, []);

    // Scroll to upcoming class every time the tab is focused
    useFocusEffect(
        useCallback(() => {
            scrollToUpcoming();
        }, [scrollToUpcoming])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Παρουσιολόγιο</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                ref={scrollViewRef}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#007AFF"
                    />
                }
            >
                {Object.entries(sessions).map(([date, daySessions]) => (
                    <View
                        key={date}
                        style={styles.dateSection}
                        onLayout={(event) => {
                            datePositions.current[date] = event.nativeEvent.layout.y;
                        }}
                    >
                        <Text style={styles.dateText}>
                            {new Date(date).toLocaleDateString('el-GR')}
                        </Text>

                        {daySessions.map((session, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.sessionCard}
                                onPress={() => router.push(`/course/${session.course_id}`)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.sessionInfo}>
                                    <Text style={styles.courseName}>
                                        {`${session.course_code} - ${session.course_name}`}
                                    </Text>
                                    <View style={styles.sessionDetails}>
                                        <Text style={styles.timeText}>
                                            {`${session.start_time.slice(0, 5)} - ${session.end_time.slice(0, 5)}`}
                                        </Text>
                                        <Text style={styles.roomText}>
                                            {session.room_number}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.statusContainer}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            { backgroundColor: getStatusColor(session.status) }
                                        ]}
                                    />
                                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
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
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
    },
    sessionInfo: {
        flex: 1,
    },
    scrollView: {
        padding: 15,
    },
    dateSection: {
        marginBottom: 20,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    sessionCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    courseName: {
        fontSize: 16,
        color: '#333',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
    },
    sessionDetails: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 10,
    },
    roomText: {
        fontSize: 14,
        color: '#999',
    },
});