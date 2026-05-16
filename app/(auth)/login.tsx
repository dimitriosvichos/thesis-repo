import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { FontFamily } from '@/constants/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('2017007');
  const [password, setPassword] = useState('12345');
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const auth = await AsyncStorage.getItem('isAuthenticated');
      const role = await AsyncStorage.getItem('userRole');
      const userId = await AsyncStorage.getItem('userId');

      if (auth === 'true' && role && userId) {
        setIsAuthenticated(true);
        setUserRole(role as 'teacher' | 'student');

        if (role === 'teacher') {
          router.replace('/(teacher)');
        } else {
          router.replace('/(app)');
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      if (error) {
        console.error('Error:', error.message);
        alert('Error checking credentials');
        return;
      }

      if (data && data.length > 0) {
        const user = data[0];
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('userId', user.id);
        await AsyncStorage.setItem('userRole', user.role);

        if (user.role === 'teacher') {
          router.replace('/(teacher)');
        } else {
          router.replace('/(app)');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.jpg')} />
      </View>


      <View style={styles.form}>
        <Text style={styles.label}>Όνομα Χρήστη</Text>
        <TextInput
          style={styles.input}
          placeholder="π.χ ds17007"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Κωδικός Χρήστη</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.checkboxLabel}>Να με θυμάσαι</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Σύνδεση</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-evenly',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    height: 500
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: FontFamily.bold,
    color: '#000',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    fontFamily: FontFamily.bold,
    padding: 12,
    marginBottom: 36,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});