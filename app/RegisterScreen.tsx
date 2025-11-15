import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  Surface,
  TextInput,
  Text,
  Card,
  Switch,
  ActivityIndicator,
  Divider,
  Provider as PaperProvider,
  DefaultTheme,
  Snackbar,
  Menu,
  Button,
} from 'react-native-paper';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

interface AreaInteres {
  id: number;
  nombre: string;
  codigo: string;
  categoria: string;
}

export default function RegisterScreen() {
  const [registerData, setRegisterData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    email: '',
    telefono: '',
    areaInteres: '',
    experiencia: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [areasInteres, setAreasInteres] = useState<AreaInteres[]>([]);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const showSnackbar = (message: string) => setSnackbar({ visible: true, message });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/areas.php`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const result = await response.json();
        if (result.success && result.areas) {
          setAreasInteres(result.areas);
        } else {
          setAreasInteres([
            { id: 1, nombre: 'Tecnología e Informática', codigo: 'TEC', categoria: 'Profesional' },
            { id: 2, nombre: 'Administración y Negocios', codigo: 'ADM', categoria: 'Profesional' },
            { id: 3, nombre: 'Ventas y Comercio', codigo: 'VEN', categoria: 'Comercial' },
            { id: 4, nombre: 'Servicios Generales', codigo: 'SER', categoria: 'Operativo' },
          ]);
        }
      } catch {
        setAreasInteres([
          { id: 1, nombre: 'Tecnología e Informática', codigo: 'TEC', categoria: 'Profesional' },
          { id: 2, nombre: 'Administración y Negocios', codigo: 'ADM', categoria: 'Profesional' },
          { id: 3, nombre: 'Ventas y Comercio', codigo: 'VEN', categoria: 'Comercial' },
          { id: 4, nombre: 'Servicios Generales', codigo: 'SER', categoria: 'Operativo' },
        ]);
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, []);

  const API_URL = `${API_BASE_URL}/registro.php`;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleSelectArea = (area: string) => {
    setRegisterData({ ...registerData, areaInteres: area });
    setMenuVisible(false);
  };

  const handleRegister = async () => {
    const {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      areaInteres,
      experiencia,
      password,
      confirmPassword,
      acceptTerms,
    } = registerData;

    if (
      !nombres ||
      !apellidos ||
      !cedula ||
      !email ||
      !telefono ||
      !areaInteres ||
      !experiencia ||
      !password ||
      !confirmPassword
    ) {
      showSnackbar('Por favor complete todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      showSnackbar('Ingresa un correo electrónico válido');
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      showSnackbar('Debe aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombres,
          apellidos,
          cedula,
          email,
          telefono,
          areaInteres,
          experiencia,
          password,
        }),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        showSnackbar('Respuesta del servidor inválida');
        return;
      }

      if (response.ok && result.success) {
        showSnackbar(result.message || 'Registro exitoso');
        setRegisterData({
          nombres: '',
          apellidos: '',
          cedula: '',
          email: '',
          telefono: '',
          areaInteres: '',
          experiencia: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false,
        });
        router.push('/LoginScreen');
      } else {
        showSnackbar(result.error || result.message || 'Error desconocido en el registro');
      }
    } catch {
      showSnackbar('Error de conexión. Intente más tarde.');
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
            <Text style={styles.headerTitle}>Quibdó Guía Dorada</Text>
            <View style={{ width: 28 }} />
          </View>
        </View>

        {/* Banner de registro con logo */}
        <View style={styles.welcomeBanner}>
          <Image
            source={require('../assets/logo-qgd.png')}
            style={{ width: 96, height: 96, borderRadius: 16 }}
            resizeMode="contain"
          />
          <Text style={styles.bannerTitle}>Crea tu Perfil</Text>
          <Text style={styles.bannerSubtitle}>Regístrate y accede a oportunidades laborales</Text>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="map-outline" size={24} color={AMBER} />
            </View>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark-outline" size={24} color={AMBER} />
            </View>
            <View style={styles.iconCircle}>
              <Ionicons name="people-outline" size={24} color={AMBER} />
            </View>
          </View>
        </View>

        {/* Tarjeta de Registro */}
        <Card style={styles.registerCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.registerHeader}>
              <Ionicons name="person-add-outline" size={32} color={AMBER} />
              <Text style={styles.cardTitle}>Crear Cuenta</Text>
              <Text style={styles.cardSubtitle}>Completa tu información para comenzar</Text>
            </View>

            {/* Nombres y Apellidos */}
            <View style={styles.rowContainer}>
              <TextInput
                label="Nombres"
                value={registerData.nombres}
                onChangeText={(text) => setRegisterData({ ...registerData, nombres: text })}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                outlineColor="#ddd"
                activeOutlineColor={AMBER}
                left={<TextInput.Icon icon="account" color={AMBER} />}
                theme={{ colors: { background: '#f3efff' } }}
              />
              <TextInput
                label="Apellidos"
                value={registerData.apellidos}
                onChangeText={(text) => setRegisterData({ ...registerData, apellidos: text })}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                outlineColor="#ddd"
                activeOutlineColor={AMBER}
                left={<TextInput.Icon icon="account-outline" color={AMBER} />}
                theme={{ colors: { background: '#f3efff' } }}
              />
            </View>

            {/* Cédula */}
            <TextInput
              label="Número de Cédula"
              value={registerData.cedula}
              onChangeText={(text) => setRegisterData({ ...registerData, cedula: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              left={<TextInput.Icon icon="card-account-details" color={AMBER} />}
              theme={{ colors: { background: '#f3efff' } }}
            />

            {/* Email */}
            <TextInput
              label="Correo Electrónico"
              value={registerData.email}
              onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              left={<TextInput.Icon icon="email" color={AMBER} />}
              theme={{ colors: { background: '#f3efff' } }}
            />

            {/* Teléfono */}
            <TextInput
              label="Teléfono"
              value={registerData.telefono}
              onChangeText={(text) => setRegisterData({ ...registerData, telefono: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              left={<TextInput.Icon icon="phone" color={AMBER} />}
              theme={{ colors: { background: '#f3efff' } }}
            />

            {/* Área de Interés */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Área de Interés Laboral</Text>
              {loadingAreas ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={AMBER} />
                  <Text style={styles.loadingMenuText}>Cargando áreas...</Text>
                </View>
              ) : (
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity style={styles.dropdownButton} onPress={() => setMenuVisible(true)}>
                      <View style={styles.dropdownContent}>
                        <Ionicons name="pricetags-outline" size={20} color={AMBER} />
                        <Text
                          style={[
                            styles.dropdownText,
                            !registerData.areaInteres && styles.dropdownPlaceholder,
                          ]}
                        >
                          {registerData.areaInteres || 'Selecciona un área'}
                        </Text>
                        <AntDesign name={menuVisible ? 'up' : 'down'} size={20} color="#666" />
                      </View>
                    </TouchableOpacity>
                  }
                  contentStyle={styles.menuContent}
                >
                  <ScrollView style={styles.menuScrollView}>
                    {areasInteres.map((area) => (
                      <Menu.Item
                        key={area.id}
                        onPress={() => handleSelectArea(area.nombre)}
                        title={area.nombre}
                        titleStyle={[
                          styles.menuItemText,
                          registerData.areaInteres === area.nombre && styles.menuItemSelected,
                        ]}
                        style={[
                          styles.menuItem,
                          registerData.areaInteres === area.nombre && styles.menuItemSelectedBg,
                        ]}
                      />
                    ))}
                  </ScrollView>
                </Menu>
              )}
              {registerData.areaInteres && (
                <View style={styles.selectedAreaBadge}>
                  <AntDesign name="lock" size={16} color="#27AE60" />
                  <Text style={styles.selectedAreaText}>
                    {areasInteres.find((a) => a.nombre === registerData.areaInteres)?.codigo}
                  </Text>
                </View>
              )}
            </View>

            {/* Años de Experiencia */}
            <TextInput
              label="Años de Experiencia"
              value={registerData.experiencia}
              onChangeText={(text) => setRegisterData({ ...registerData, experiencia: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ej: 2"
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              left={<TextInput.Icon icon="briefcase" color={AMBER} />}
              theme={{ colors: { background: '#f3efff' } }}
            />

            {/* Contraseñas */}
            <TextInput
              label="Contraseña"
              value={registerData.password}
              onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              left={<TextInput.Icon icon="lock" color={AMBER} />}
              theme={{ colors: { background: '#f3efff' } }}
            />
            <TextInput
              label="Confirmar Contraseña"
              value={registerData.confirmPassword}
              onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor={AMBER}
              left={<TextInput.Icon icon="lock-check" color={AMBER} />}
              theme={{ colors: { background: '#f3efff' } }}
            />

            {/* Términos y Condiciones */}
            <View style={styles.termsContainer}>
              <Switch
                value={registerData.acceptTerms}
                onValueChange={(value) => setRegisterData({ ...registerData, acceptTerms: value })}
                color={AMBER}
              />
              <TouchableOpacity style={styles.termsTextContainer}>
                <Text style={styles.termsText}>Acepto los términos y condiciones de uso</Text>
              </TouchableOpacity>
            </View>

            {/* Botón de Registro */}
            <Button
              mode="contained"
              onPress={handleRegister}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.registerButtonContent}
              labelStyle={styles.registerButtonLabel}
              buttonColor={AMBER}
              loading={loading}
            >
              {!loading && (
                <Ionicons name="person-add-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
              Crear Cuenta
            </Button>

            <Divider style={styles.divider} />

            {/* Link para Login */}
            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/LoginScreen')}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <Text style={styles.loginLinkText}>Inicia sesión</Text>
            </TouchableOpacity>

            {/* Información de seguridad/comunidad */}
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Beneficios de registrarte:</Text>
              <View style={styles.securityItem}>
                <Ionicons name="ribbon-outline" size={16} color="#666" />
                <Text style={styles.securityText}>Acceso a vacantes exclusivas</Text>
              </View>
              <View style={styles.securityItem}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
                <Text style={styles.securityText}>Tus datos están protegidos</Text>
              </View>
              <View style={styles.securityItem}>
                <Ionicons name="notifications-outline" size={16} color="#666" />
                <Text style={styles.securityText}>Notificaciones de nuevas ofertas</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Footer informativo */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
          <Text style={styles.footerText}>Registro seguro y verificado</Text>
        </View>

        {loading && (
          <Surface style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={AMBER} />
            <Text style={styles.loadingText}>Creando tu cuenta...</Text>
          </Surface>
        )}
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
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
  welcomeBanner: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 15 },
  bannerSubtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  iconRow: { flexDirection: 'row', marginTop: 25, gap: 15 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3efff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerCard: {
    marginHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  cardContent: { padding: 20 },
  registerHeader: { alignItems: 'center', marginBottom: 25 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 12 },
  cardSubtitle: { fontSize: 13, color: '#666', marginTop: 6, textAlign: 'center' },
  input: { marginBottom: 12, backgroundColor: '#f3efff' },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  halfInput: { flex: 1 },
  sectionContainer: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, color: '#333', fontWeight: '600', marginBottom: 12 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#f3efff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingMenuText: { color: '#666', fontSize: 14 },
  dropdownButton: {
    backgroundColor: '#f3efff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  dropdownContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#333' },
  dropdownPlaceholder: { color: '#999' },
  menuContent: { backgroundColor: '#FFFFFF', maxHeight: 400, marginTop: 8, borderRadius: 10 },
  menuScrollView: { maxHeight: 350 },
  menuItem: { minHeight: 56 },
  menuItemText: { fontSize: 15, color: '#333' },
  menuItemSelected: { color: AMBER, fontWeight: '600' },
  menuItemSelectedBg: { backgroundColor: '#FFF6E6' },
  selectedAreaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D5F4E6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  selectedAreaText: { color: '#27AE60', fontSize: 12, fontWeight: '600' },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  termsTextContainer: { flex: 1, marginLeft: 12 },
  termsText: { color: '#666', fontSize: 14, lineHeight: 20 },
  registerButton: { width: '100%', borderRadius: 10, elevation: 2, marginBottom: 20 },
  registerButtonContent: { paddingVertical: 8 },
  registerButtonLabel: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  divider: { marginVertical: 20, backgroundColor: '#eee' },
  loginLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  loginText: { color: '#666', fontSize: 14 },
  loginLinkText: { color: AMBER, fontSize: 14, fontWeight: '600' },
  securityInfo: {
    backgroundColor: '#f3efff',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: AMBER,
  },
  securityTitle: { fontSize: 14, color: '#333', fontWeight: '600', marginBottom: 8 },
  securityItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  securityText: { fontSize: 12, color: '#666' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  footerText: { color: '#666', marginLeft: 8, fontSize: 12 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
  loadingText: { marginTop: 16, textAlign: 'center', color: AMBER, fontSize: 16, fontWeight: '500' },
  snackbar: { backgroundColor: '#333' },
});
