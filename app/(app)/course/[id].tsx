import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CourseDetails {
    id: string;
    course_name: string;
    course_code: string;
    semester: string;
    academic_year: string;
    description?: string;
    credits?: number;
    schedule_info?: string;
    teacher?: {
        first_name: string;
        last_name: string;
    };
}

interface AttendanceStats {
    totalSessions: number;
    completedSessions: number;
    myAttendance: number;
    attendancePercentage: number;
    ranking: number;
    totalStudents: number;
    percentile: number;
}

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000, style }: { value: number; duration?: number; style?: any }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setDisplayValue(Math.floor(progress * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <Text style={style}>{displayValue}</Text>;
};

// Animated progress bar component
const AnimatedProgressBar = ({ percentage, color, delay = 0 }: { percentage: number; color: string; delay?: number }) => {
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
            Animated.timing(widthAnim, {
                toValue: percentage,
                duration: 800,
                useNativeDriver: false,
            }).start();
        }, delay);

        return () => clearTimeout(timeout);
    }, [percentage, delay]);

    const animatedWidth = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[
                    styles.progressBarFill,
                    {
                        width: animatedWidth,
                        backgroundColor: color,
                    },
                ]}
            />
        </View>
    );
};

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

// Skeleton loading screen
const SkeletonLoader = () => {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#007AFF',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.replace('/attendance')}
                            style={{ marginLeft: 10, padding: 5 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView style={styles.container}>
                {/* Header Skeleton */}
                <View style={styles.header}>
                    <SkeletonBox width="80%" height={28} style={{ marginBottom: 8 }} />
                    <SkeletonBox width="30%" height={16} style={{ marginBottom: 15 }} />
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <SkeletonBox width={80} height={20} />
                        <SkeletonBox width={80} height={20} />
                        <SkeletonBox width={60} height={20} />
                    </View>
                    <SkeletonBox width="50%" height={18} style={{ marginTop: 12 }} />
                </View>

                {/* Stats Section Skeleton */}
                <View style={styles.statsSection}>
                    <SkeletonBox width={120} height={20} style={{ marginBottom: 12 }} />

                    {/* Main stat card skeleton */}
                    <View style={[styles.mainStatCard, { justifyContent: 'flex-start' }]}>
                        <View style={{ flex: 1 }}>
                            <SkeletonBox width={100} height={40} style={{ marginBottom: 8 }} />
                            <SkeletonBox width={80} height={16} style={{ marginBottom: 10 }} />
                            <SkeletonBox width="100%" height={8} />
                        </View>
                        <SkeletonBox width={70} height={50} style={{ borderRadius: 20, marginLeft: 15 }} />
                    </View>

                    {/* Session breakdown skeleton */}
                    <View style={[styles.sessionBreakdown, { marginTop: 12 }]}>
                        <View style={styles.breakdownItem}>
                            <SkeletonBox width={30} height={24} style={{ marginBottom: 4 }} />
                            <SkeletonBox width={70} height={14} />
                        </View>
                        <View style={styles.breakdownDivider} />
                        <View style={styles.breakdownItem}>
                            <SkeletonBox width={30} height={24} style={{ marginBottom: 4 }} />
                            <SkeletonBox width={70} height={14} />
                        </View>
                        <View style={styles.breakdownDivider} />
                        <View style={styles.breakdownItem}>
                            <SkeletonBox width={30} height={24} style={{ marginBottom: 4 }} />
                            <SkeletonBox width={50} height={14} />
                        </View>
                    </View>

                    {/* Ranking section skeleton */}
                    <SkeletonBox width={100} height={20} style={{ marginTop: 20, marginBottom: 12 }} />
                    <View style={styles.rankingCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <SkeletonBox width={60} height={60} style={{ borderRadius: 30 }} />
                            <View style={{ marginLeft: 15 }}>
                                <SkeletonBox width={100} height={16} style={{ marginBottom: 6 }} />
                                <SkeletonBox width={60} height={22} />
                            </View>
                        </View>
                        <SkeletonBox width="100%" height={8} style={{ marginBottom: 15 }} />
                        <SkeletonBox width={120} height={16} style={{ alignSelf: 'center' }} />
                    </View>
                </View>

                {/* Info section skeleton */}
                <View style={styles.infoSection}>
                    <SkeletonBox width={100} height={20} style={{ marginBottom: 12 }} />
                    <View style={styles.infoCard}>
                        <SkeletonBox width={20} height={20} style={{ borderRadius: 10 }} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <SkeletonBox width={60} height={14} style={{ marginBottom: 4 }} />
                            <SkeletonBox width="80%" height={18} />
                        </View>
                    </View>
                    <View style={styles.descriptionCard}>
                        <SkeletonBox width={80} height={14} style={{ marginBottom: 8 }} />
                        <SkeletonBox width="100%" height={16} style={{ marginBottom: 6 }} />
                        <SkeletonBox width="90%" height={16} style={{ marginBottom: 6 }} />
                        <SkeletonBox width="70%" height={16} />
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </>
    );
};

export default function CourseDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Fade-in animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Reset state when ID changes to show skeleton
    useEffect(() => {
        if (id) {
            // Reset everything when navigating to a new course
            setLoading(true);
            setCourse(null);
            setStats(null);
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
            fetchCourseDetails();
        }
    }, [id]);

    useEffect(() => {
        if (!loading && course) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [loading, course]);

    const fetchCourseDetails = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId || !id) return;

            // First, get the user's username for attendance queries
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('id', userId)
                .single();

            if (userError) throw userError;
            const username = userData?.username;

            // Fetch course details with teacher info
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select(`
                    id,
                    course_name,
                    course_code,
                    semester,
                    academic_year,
                    description,
                    credits,
                    schedule_info,
                    teacher:users!courses_teacher_id_fkey (
                        first_name,
                        last_name
                    )
                `)
                .eq('id', id)
                .single();

            if (courseError) throw courseError;
            setCourse(courseData);

            // Fetch all sessions for this course
            const { data: sessions, error: sessionsError } = await supabase
                .from('class_sessions')
                .select('id, status')
                .eq('course_id', id);

            if (sessionsError) throw sessionsError;

            const totalSessions = sessions?.length || 0;
            const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
            const sessionIds = sessions?.map(s => s.id) || [];

            // Fetch my attendance count
            const { count: myAttendance } = await supabase
                .from('attendance')
                .select('*', { count: 'exact', head: true })
                .eq('student_username', username)
                .in('class_session_id', sessionIds);

            // Fetch all students enrolled in this course with their usernames
            const { data: enrolledStudents } = await supabase
                .from('course_enrollments')
                .select(`
                    student_id,
                    users:student_id (username)
                `)
                .eq('course_id', id);

            const students = enrolledStudents?.map(e => ({
                id: e.student_id,
                username: (e.users as any)?.username
            })).filter(s => s.username) || [];
            const totalStudents = students.length;

            // Calculate attendance for each student to determine ranking
            const studentAttendanceCounts: { studentId: string; username: string; count: number }[] = [];

            for (const student of students) {
                const { count } = await supabase
                    .from('attendance')
                    .select('*', { count: 'exact', head: true })
                    .eq('student_username', student.username)
                    .in('class_session_id', sessionIds);

                studentAttendanceCounts.push({
                    studentId: student.id,
                    username: student.username,
                    count: count || 0
                });
            }

            // Sort by attendance count (descending) to find ranking
            studentAttendanceCounts.sort((a, b) => b.count - a.count);

            const myRank = studentAttendanceCounts.findIndex(s => s.username === username) + 1;
            const percentile = totalStudents > 0
                ? Math.round(((totalStudents - myRank + 1) / totalStudents) * 100)
                : 0;

            const attendancePercentage = completedSessions > 0
                ? Math.round(((myAttendance || 0) / completedSessions) * 100)
                : 0;

            setStats({
                totalSessions,
                completedSessions,
                myAttendance: myAttendance || 0,
                attendancePercentage,
                ranking: myRank,
                totalStudents,
                percentile
            });

        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (!course) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#FF5722" />
                <Text style={styles.errorText}>Το μάθημα δεν βρέθηκε</Text>
            </View>
        );
    }

    const getPercentileColor = (percentile: number) => {
        if (percentile >= 90) return '#4CAF50';
        if (percentile >= 70) return '#8BC34A';
        if (percentile >= 50) return '#FFC107';
        if (percentile >= 30) return '#FF9800';
        return '#FF5722';
    };

    const getPercentileLabel = (percentile: number) => {
        if (percentile >= 90) return 'Εξαιρετική θέση!';
        if (percentile >= 70) return 'Πολύ καλή θέση';
        if (percentile >= 50) return 'Μέση θέση';
        if (percentile >= 30) return 'Χρειάζεται βελτίωση';
        return 'Χαμηλή παρουσία';
    };

    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 70) return '#4CAF50';
        if (percentage >= 50) return '#FFC107';
        return '#FF5722';
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: course.course_code,
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: '#007AFF',
                    },
                    headerTitleStyle: {
                        color: 'white',
                        fontWeight: '600',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.replace('/attendance')}
                            style={{ marginLeft: 10, padding: 5 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView style={styles.container}>
                {/* Course Header */}
                <View style={styles.header}>
                    <Text style={styles.courseName}>{course.course_name}</Text>
                    <Text style={styles.courseCode}>{course.course_code}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.metaText}>{course.semester}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="school-outline" size={16} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.metaText}>{course.academic_year}</Text>
                        </View>
                        {course.credits && (
                            <View style={styles.metaItem}>
                                <Ionicons name="ribbon-outline" size={16} color="rgba(255,255,255,0.8)" />
                                <Text style={styles.metaText}>{course.credits} ECTS</Text>
                            </View>
                        )}
                    </View>

                    {course.teacher && (
                        <View style={styles.teacherRow}>
                            <Ionicons name="person-outline" size={16} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.teacherText}>
                                {course.teacher.first_name} {course.teacher.last_name}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Attendance Stats with animations */}
                {stats && (
                    <Animated.View
                        style={[
                            styles.statsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Η Παρουσία μου</Text>

                        {/* Main attendance stat with animated counter and progress bar */}
                        <View style={styles.mainStatCard}>
                            <View style={styles.mainStatContent}>
                                <View style={styles.attendanceNumbers}>
                                    <AnimatedCounter
                                        value={stats.myAttendance}
                                        duration={800}
                                        style={styles.mainStatNumber}
                                    />
                                    <Text style={styles.mainStatNumber}>/{stats.completedSessions}</Text>
                                </View>
                                <Text style={styles.mainStatLabel}>παρουσίες</Text>
                                <AnimatedProgressBar
                                    percentage={stats.attendancePercentage}
                                    color={getAttendanceColor(stats.attendancePercentage)}
                                    delay={200}
                                />
                            </View>
                            <View style={[
                                styles.percentageBadge,
                                { backgroundColor: getAttendanceColor(stats.attendancePercentage) }
                            ]}>
                                <AnimatedCounter
                                    value={stats.attendancePercentage}
                                    duration={1000}
                                    style={styles.percentageText}
                                />
                                <Text style={styles.percentageText}>%</Text>
                            </View>
                        </View>

                        {/* Sessions breakdown with animated counters */}
                        <View style={styles.sessionBreakdown}>
                            <View style={styles.breakdownItem}>
                                <AnimatedCounter
                                    value={stats.completedSessions}
                                    duration={600}
                                    style={styles.breakdownNumber}
                                />
                                <Text style={styles.breakdownLabel}>Ολοκληρωμένα</Text>
                            </View>
                            <View style={styles.breakdownDivider} />
                            <View style={styles.breakdownItem}>
                                <AnimatedCounter
                                    value={stats.totalSessions - stats.completedSessions}
                                    duration={600}
                                    style={styles.breakdownNumber}
                                />
                                <Text style={styles.breakdownLabel}>Επερχόμενα</Text>
                            </View>
                            <View style={styles.breakdownDivider} />
                            <View style={styles.breakdownItem}>
                                <AnimatedCounter
                                    value={stats.totalSessions}
                                    duration={600}
                                    style={styles.breakdownNumber}
                                />
                                <Text style={styles.breakdownLabel}>Σύνολο</Text>
                            </View>
                        </View>

                        {/* Ranking section */}
                        <Text style={styles.sectionTitle}>Κατάταξη</Text>
                        <View style={styles.rankingCard}>
                            <View style={styles.rankingContent}>
                                <View style={[styles.rankBadge, { backgroundColor: getPercentileColor(stats.percentile) }]}>
                                    <Text style={styles.rankNumber}>#{stats.ranking}</Text>
                                </View>
                                <View style={styles.rankingInfo}>
                                    <Text style={styles.rankingText}>
                                        από {stats.totalStudents} φοιτητές
                                    </Text>
                                    <Text style={[styles.percentileText2, { color: getPercentileColor(stats.percentile) }]}>
                                        Top {100 - stats.percentile + 1}%
                                    </Text>
                                </View>
                            </View>
                            <AnimatedProgressBar
                                percentage={stats.percentile}
                                color={getPercentileColor(stats.percentile)}
                                delay={400}
                            />
                            <Text style={[styles.percentileLabel, { color: getPercentileColor(stats.percentile) }]}>
                                {getPercentileLabel(stats.percentile)}
                            </Text>
                        </View>
                    </Animated.View>
                )}

                {/* Course Info */}
                {(course.description || course.schedule_info) && (
                    <Animated.View
                        style={[
                            styles.infoSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Πληροφορίες</Text>

                        {course.schedule_info && (
                            <View style={styles.infoCard}>
                                <Ionicons name="time-outline" size={20} color="#007AFF" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Πρόγραμμα</Text>
                                    <Text style={styles.infoValue}>{course.schedule_info}</Text>
                                </View>
                            </View>
                        )}

                        {course.description && (
                            <View style={styles.descriptionCard}>
                                <Text style={styles.descriptionLabel}>Περιγραφή</Text>
                                <Text style={styles.descriptionText}>{course.description}</Text>
                            </View>
                        )}
                    </Animated.View>
                )}

                <View style={styles.bottomPadding} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingTop: 20,
        paddingBottom: 25,
    },
    courseName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    courseCode: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
        gap: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    metaText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
    },
    teacherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    teacherText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    statsSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        marginTop: 5,
    },
    mainStatCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mainStatContent: {
        flex: 1,
        marginRight: 15,
    },
    attendanceNumbers: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    mainStatNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    mainStatLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
        marginBottom: 10,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    percentageBadge: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    percentageText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    sessionBreakdown: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    breakdownItem: {
        flex: 1,
        alignItems: 'center',
    },
    breakdownNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    breakdownLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    breakdownDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 5,
    },
    rankingCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rankingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    rankBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    rankingInfo: {
        marginLeft: 15,
    },
    rankingText: {
        fontSize: 14,
        color: '#666',
    },
    percentileText2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
    },
    percentileLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 15,
        textAlign: 'center',
    },
    infoSection: {
        padding: 15,
        paddingTop: 0,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
    },
    infoValue: {
        fontSize: 15,
        color: '#333',
        marginTop: 2,
    },
    descriptionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
    },
    descriptionLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 6,
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    bottomPadding: {
        height: 30,
    },
});
