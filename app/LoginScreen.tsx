import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  TextInput,
  Text,
  Card,
  Divider,
  Provider as PaperProvider,
  DefaultTheme,
  Snackbar,
  Button,
} from 'react-native-paper';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.112/Back';
const AMBER = '#F59E0B';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: AMBER,
    accent: AMBER,
    background: '#fff',
    surface: '#FFFFFF',
    text: '#333',
  },
};

export default function LoginScreen() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const router = useRouter();
  const API_URL = `${API_BASE_URL}/login.php`;

  const showSnackbar = (message: string) => setSnackbar({ visible: true, message });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    if (!loginData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Ingresa un correo electrónico válido';
    if (!loginData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const saveUserSession = async (token: string, user: any) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('userSession', JSON.stringify(user));
    } catch {}
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        showSnackbar(result.message);
        await saveUserSession(result.token, result.user);
        setTimeout(() => {
          if (result.user.rol === 1) router.push('/pantalla_principal');
          else if (result.user.rol === 2) router.push('/pantalla_principal');
          else showSnackbar('Rol de usuario no válido. Contacte al administrador.');
        }, 500);
      } else {
        showSnackbar(result.error || 'Credenciales incorrectas');
      }
    } catch {
      showSnackbar('Ocurrió un error. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QGD</Text>
            <View style={{ width: 28 }} />
          </View>
        </View>

        {/* Banner de bienvenida con logo */}

        {/* Tarjeta de Login */}
        <Card style={styles.loginCard}>
          <View style={styles.welcomeBanner}>
          <Image
            source={require('../assets/logo-qgd.png')}
            style={{ width: 96, height: 96, borderRadius: 16 }}
            resizeMode="contain"
          />
          <Text style={styles.bannerTitle}>Bienvenido</Text>
          <Text style={styles.bannerSubtitle}>Quibdó Guía Dorada</Text>
          </View>
          <Card.Content style={styles.cardContent}>
            <View style={styles.loginHeader}>
              <Text style={styles.cardTitle}>Iniciar Sesión</Text>
              <Text style={styles.cardSubtitle}>Accede a tu cuenta</Text>
            </View>

            <TextInput
              label="Correo"
              value={loginData.email}
              onChangeText={(text) => setLoginData({ ...loginData, email: text })}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!errors.email}
              left={<TextInput.Icon icon="email" color={AMBER} />}
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              theme={{ colors: { background: '#f3efff' } }}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              label="Contraseña"
              value={loginData.password}
              onChangeText={(text) => setLoginData({ ...loginData, password: text })}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              error={!!errors.password}
              left={<TextInput.Icon icon="lock" color={AMBER} />}
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              theme={{ colors: { background: '#f3efff' } }}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Botón de inicio de sesión */}
            <View style={styles.loginSection}>
              <Button
                mode="contained"
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
                buttonColor={AMBER}
                loading={loading}
              >
                {!loading && <AntDesign name="lock" size={20} color="#fff" style={{ marginRight: 8 }} />}
                Iniciar Sesión
              </Button>
              <Text style={styles.roleInfo}>
                Tu rol será asignado automáticamente según tu registro
              </Text>
            </View>

            <Divider style={styles.divider} />

            {/* Link de registro */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => router.push('./RegisterScreen')}
            >
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <Text style={styles.registerLinkText}>Regístrate ahora</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Sección de seguridad */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Tus datos están protegidos</Text>
        </View>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        action={{ label: 'Cerrar', onPress: () => setSnackbar({ ...snackbar, visible: false }) }}
        style={styles.snackbar}
      >
        {snackbar.message}
      </Snackbar>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 50, paddingHorizontal: 15, backgroundColor: '#fff', paddingBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  welcomeBanner: { backgroundColor: '#fff', paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 15 },
  bannerSubtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  iconRow: { flexDirection: 'row', marginTop: 25, gap: 15 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3efff', alignItems: 'center', justifyContent: 'center' },
  loginCard: { marginHorizontal: 15, borderRadius: 12, elevation: 1, backgroundColor: '#fff', marginBottom: 5 },
  cardContent: { padding: 20 },
  loginHeader: { alignItems: 'center', marginBottom: 25 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 12 },
  cardSubtitle: { fontSize: 13, color: '#666', marginTop: 6, textAlign: 'center' },
  input: { marginBottom: 12, backgroundColor: '#f3efff' },
  errorText: { color: '#E74C3C', fontSize: 12, marginTop: -8, marginBottom: 10, marginLeft: 5 },
  loginSection: { marginTop: 10, alignItems: 'center' },
  loginButton: { width: '100%', borderRadius: 10, elevation: 2 },
  loginButtonContent: { paddingVertical: 8 },
  loginButtonLabel: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  roleInfo: { textAlign: 'center', color: '#666', fontSize: 11, marginTop: 12, fontStyle: 'italic' },
  divider: { marginVertical: 20, backgroundColor: '#eee' },
  registerLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  registerText: { color: '#666', fontSize: 14 },
  registerLinkText: { color: AMBER, fontSize: 14, fontWeight: '600' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  footerText: { color: '#666', marginLeft: 8, fontSize: 12 },
  snackbar: { backgroundColor: '#333' },
});
