import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import colors from '../theme/colors';
import AbstractBackground from '../components/AbstractBackground';
import Card from '../components/Card';
import ModernButton from '../components/ModernButton';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tus credenciales');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register({
        name,
        email,
        password,
        restaurantName: 'Mi Restaurante',
        restaurantAddress: {
          street: 'Calle Principal',
          city: 'Ciudad',
          state: 'Estado',
          zipCode: '00000',
          country: 'Colombia'
        },
        restaurantContact: {
          phone: '+57 300 123 4567',
          email: email
        }
      });
      
      if (result.success) {
        Alert.alert('Éxito', 'Registro exitoso. Iniciando sesión...');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AbstractBackground variant="login">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={colors.gradient}
                style={styles.logoGradient}
              >
                <Feather name="trending-up" size={32} color={colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Bienvenido a CDP</Text>
            <Text style={styles.subtitle}>Gestión inteligente para tu negocio</Text>
          </View>

          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.toggleContainer}>
              <ModernButton
                title="Iniciar Sesión"
                onPress={() => setIsRegistering(false)}
                variant={!isRegistering ? "gradient" : "outlined"}
                size="medium"
              />
              <ModernButton
                title="Registrarse"
                onPress={() => setIsRegistering(true)}
                variant={isRegistering ? "gradient" : "outlined"}
                size="medium"
              />
            </View>

            {isRegistering && (
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre completo"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <ModernButton
              title={isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
              onPress={isRegistering ? handleRegister : handleLogin}
              variant="gradient"
              size="large"
              icon={isRegistering ? "user-plus" : "log-in"}
              style={styles.loginButton}
              loading={loading}
              disabled={loading}
            />

            {!isRegistering && (
              <View style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </View>
            )}
          </Card>

          <Text style={styles.footer}>CDP © 2025 - Todos los derechos reservados</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </AbstractBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    marginBottom: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
