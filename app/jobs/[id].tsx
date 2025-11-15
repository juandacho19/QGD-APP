import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// --- MOCK EMPRESAS Y VACANTES ---
const AMBER = '#ffc107';
const GREEN = '#10B981';

const jobImages = {
  admin: require('../../assets/oroexpress.png'),
  bodega: require('../../assets/MERCADIARIO.png'),
  dev: require('../../assets/comfachoco.png'),
} as const;
const companyLogos = {
  'Empresa X S.A.': require('../../assets/oroexpress.png'), // Usa un logo realmente vertical de ejemplo
  'Logística Chocó': require('../../assets/MERCADIARIO.png'),
  'Tech Solutions': require('../../assets/comfachoco.png'),
  // ...agrega logos de empresa reales aquí...
};

type Job = {
  id: string;
  title: string;
  company: string;
  companyDescription?: string;
  companyType?: string;
  companyContact?: string;
  companyLogoKey?: keyof typeof companyLogos;
  location: string;
  salary: string;
  type: string;
  description: string;
  imageKey: keyof typeof jobImages;
  benefits?: string[];
  companyServices?: string[];
};

const JOBS: Job[] = [
  {
    id: 'job1',
    title: 'Asistente Administrativo',
    company: 'Empresa X S.A.',
    location: 'Quibdó',
    salary: '1.8M COP',
    type: 'Tiempo completo',
    description: 'Gestión de documentos y atención al cliente en oficina administrativa. Experiencia en manejo de archivos, llamadas y recepción.',
    imageKey: 'admin',
    companyDescription: 'Empresa líder en soluciones administrativas y tecnológicas para compañías nacionales.',
    companyType: 'Servicios administrativos',
    companyContact: 'info@empresax.com',
    companyLogoKey: 'Empresa X S.A.',
    companyServices: ['Consultoría empresarial', 'Gestión documental', 'Servicios legales'],
    benefits: ['Vacaciones pagadas', 'Prestaciones de ley', 'Capacitación continua'],
  },
  {
    id: 'job2',
    title: 'Operario de Bodega',
    company: 'Logística Chocó',
    location: 'Quibdó',
    salary: '1.3M COP',
    type: 'Medio tiempo',
    description: 'Carga y descarga de mercancía. Inventario, manejo de montacargas y logística básica.',
    imageKey: 'bodega',
    companyDescription: 'Empresa regional especializada en logística, transporte de mercancías y soluciones para comercio local.',
    companyType: 'Logística y transporte',
    companyContact: 'rrhh@logisticachoco.com',
    companyLogoKey: 'Logística Chocó',
    companyServices: ['Transporte terrestre', 'Almacenamiento', 'Gestión aduanera'],
    benefits: ['Uniforme', 'Pago quincenal'],
  },
  // Añade más vacantes y empresas aquí...
];

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const job = useMemo(() => JOBS.find(j => j.id === id) ?? JOBS[0], [id]);
  const companyLogo = job.companyLogoKey ? companyLogos[job.companyLogoKey] : null;

  return (
    <ScrollView style={styles.bg}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={router.back}>
          <Ionicons name="arrow-back" size={22} color="#232323" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vacante</Text>
        <Ionicons name="share-social-outline" size={22} color={AMBER} style={styles.headerIcon} />
      </View>
      {/* Logo vertical o cuadrado siempre centrado */}
      {companyLogo && (
        <View style={styles.logoArea}>
          <View style={styles.logoBG}>
            <Image
              source={companyLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
      {/* Card principal */}
      <View style={styles.card}>
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Ionicons name="briefcase-outline" size={15} color="#fff" />
            <Text style={styles.chipTxt}>{job.type}</Text>
          </View>
          <View style={styles.chipLight}>
            <Ionicons name="location-outline" size={15} color={AMBER} />
            <Text style={styles.chipTxtAlt}>{job.location}</Text>
          </View>
        </View>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.desc}>{job.description}</Text>
        <View style={styles.salaryBox}>
          <Ionicons name="cash-outline" size={18} color={GREEN} style={{ marginRight: 5 }} />
          <Text style={styles.salary}>{job.salary}</Text>
        </View>
      </View>
      {/* Sobre la empresa */}
      <View style={styles.card}>
        <View style={styles.companyHeader}>
          {companyLogo && (
            <Image source={companyLogo} style={styles.companyLogoMini} resizeMode="contain" />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.companyName}>{job.company}</Text>
            <Text style={styles.companyType}>{job.companyType || 'Empresa'}</Text>
          </View>
        </View>
        {job.companyDescription && (
          <Text style={styles.companyDescription}>{job.companyDescription}</Text>
        )}
        {!!job.companyContact && (
          <View style={styles.companyContactRow}>
            <Ionicons name="mail-outline" size={15} color={AMBER} style={{ marginRight: 6 }} />
            <Text style={styles.companyContactText}>{job.companyContact}</Text>
          </View>
        )}
      </View>
      {/* Servicios Empresa */}
      {!!job.companyServices?.length && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Servicios que ofrece la empresa</Text>
          <View style={styles.servicesRow}>
            {job.companyServices.map(srv => (
              <View key={srv} style={styles.serviceChip}>
                <Ionicons name="checkmark-circle-outline" size={13} color={AMBER} style={{ marginRight: 4 }} />
                <Text style={styles.serviceChipText}>{srv}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {/* Beneficios */}
      {!!job.benefits?.length && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Beneficios</Text>
          {job.benefits.map(b => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color={AMBER} style={{ marginRight: 7 }} />
              <Text style={styles.benefitTxt}>{b}</Text>
            </View>
          ))}
        </View>
      )}
      {/* Botón postular */}
      <View style={styles.actionsWrap}>
        <TouchableOpacity style={styles.cta}>
          <Ionicons name="send-outline" color="#fff" size={18} style={{ marginRight: 10 }} />
          <Text style={styles.ctaTxt}>Postularme</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'stretch', justifyContent: 'space-between',
    paddingTop: 45, paddingHorizontal: 15, paddingBottom: 5, backgroundColor: '#fff',
  },
  headerTitle: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  headerIcon: { padding: 5, borderRadius: 7 },

  // LOGO EMPRESA DESTACADO
  logoArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 9,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoBG: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#FFFBEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  // Mini logo para info empresa
  companyLogoMini: { width: 32, height: 32, marginRight: 12, borderRadius: 8, backgroundColor: '#FFF6E6' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: 14,
    padding: 18,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 7, shadowOffset: { width: 0, height: 2 },
  },
  title: { fontSize: 21, fontWeight: 'bold', color: '#242424', marginBottom: 7 },
  company: { color: '#FFB300', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  desc: { color: '#444', fontSize: 14, marginBottom: 16 },
  chipsRow: { flexDirection: 'row', gap: 9, marginBottom: 5 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: AMBER, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 3,
    marginRight: 9, gap: 6,
  },
  chipTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  chipLight: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF6E6', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, gap: 6,
  },
  chipTxtAlt: { color: AMBER, fontWeight: '700', fontSize: 12 },
  salaryBox: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#EEFDE8', padding: 9, borderRadius: 9, alignSelf: 'flex-start' },
  salary: { color: GREEN, fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { fontWeight: 'bold', fontSize: 15, color: '#333', marginBottom: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  benefitTxt: { color: '#333', fontSize: 13 },
  actionsWrap: { alignItems: 'center', marginTop: 24 },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: AMBER, paddingHorizontal: 38, paddingVertical: 13, borderRadius: 99, elevation: 2,
  },
  ctaTxt: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // EMPRESA
  companyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  companyName: { fontWeight: 'bold', color: '#111', fontSize: 15 },
  companyType: { color: '#ba8600', backgroundColor: '#FFF6E6', alignSelf: 'flex-start', paddingHorizontal: 8, borderRadius: 7, marginTop: 1, fontWeight: '700', fontSize: 11, marginBottom: 2 },
  companyDescription: { color: '#444', fontSize: 13, marginBottom: 3 },
  companyContactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  companyContactText: { color: '#888', fontWeight: 'bold', fontSize: 13 },

  // Servicios/skills
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  serviceChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF6E6',
    borderRadius: 13, marginRight: 7, marginBottom: 3, paddingVertical: 5, paddingHorizontal: 11,
  },
  serviceChipText: { color: '#232323', fontWeight: 'bold', fontSize: 13 },
});
