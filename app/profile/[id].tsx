import React, { useMemo, useState } from 'react';
import { 
  View, ScrollView, StyleSheet, Image, TouchableOpacity, FlatList 
} from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AMBER = '#F59E0B';

// MOCK DATA
const repImages = {
  juan: require('../../assets/juan.jpg'),
  juanca: require('../../assets/juanca.jpg'),
  leo: require('../../assets/Leo.jpg'),
  alzate: require('../../assets/alzate.jpg'),
  sergio: require('../../assets/sergio.jpg'),
  tecno: require('../../assets/tecno-movil.jpg'),
  lina:  require('../../assets/lina.jpg'),
  carlos:  require('../../assets/carlos.jpg'),
} as const;

const galleryImages: any[] = [
  { id: 1, uri: require('../../assets/juan.jpg') },
  { id: 2, uri: require('../../assets/Leo.jpg') },
  { id: 3, uri: require('../../assets/juanca.jpg') },
  { id: 4, uri: require('../../assets/alzate.jpg') },
  { id: 5, uri: require('../../assets/sergio.jpg') },
  { id: 6, uri: require('../../assets/tecno-movil.jpg') },
  { id: 7, uri: require('../../assets/lina.jpg') },
  { id: 8, uri: require('../../assets/carlos.jpg') },
  // agrega más imágenes reales aquí...
];

type Representative = {
  id: string;
  name: string;
  description: string;
  imageKey: keyof typeof repImages;
  category: string;
  rating: number;
  phone?: string;
  email?: string;
  verified?: boolean;
  type?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  bioLong?: string;
};

const DATA: Representative[] = [
  {
    id: 'rep1',
    name: 'Juan David',
    description: 'Estudiante de Ingeniería de Telecomunicaciones',
    imageKey: 'juan',
    category: 'Tecnología',
    rating: 4.8,
    phone: '321 230 7020',
    email: 'juan@quibdo.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: 'Apasionado por la tecnología. Soporte de redes y sistemas universitarios.',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'Con más de 5 años de experiencia, Juan ha trabajado en proyectos colaborativos de tecnología, desarrollando soluciones eficientes y brindando soporte integral a diversos clientes en la región de Quibdó.',
  },
  {
    id: 'rep2',
    name: 'Juan Carlos Romaña',
    description: 'Estudiante de Ingeniería de Telecomunicaciones',
    imageKey: 'juanca',
    category: 'Tecnología',
    rating: 4.3,
    phone: '321 230 7020',
    email: 'juanca@quibdo.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: 'Apasionado por la tecnología. Soporte de redes y sistemas universitarios.',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'Con más de 5 años de experiencia, Juan ha trabajado en proyectos colaborativos de tecnología, desarrollando soluciones eficientes y brindando soporte integral a diversos clientes en la región de Quibdó.',
  },
  {
    id: 'rep3',
    name: 'Xavier Leonardo Mosquera Arreaga',
    description: 'Estudiante de Ingeniería de Telecomunicaciones',
    imageKey: 'leo',
    category: 'Tecnología',
    rating: 4.8,
    phone: '321 230 7020',
    email: 'Xavier@quibdo.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: 'Apasionado por la tecnología. Soporte de redes y sistemas universitarios.',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'Con más de 5 años de experiencia, Juan ha trabajado en proyectos colaborativos de tecnología, desarrollando soluciones eficientes y brindando soporte integral a diversos clientes en la región de Quibdó.',
  },
  {
    id: 'rep4',
    name: 'Jose Leandro Alzate Morales',
    description: 'Estudiante de Ingeniería de Telecomunicaciones',
    imageKey: 'alzate',
    category: 'Tecnología',
    rating: 4.8,
    phone: '321 230 7020',
    email: 'sergio@quibdo.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: 'Apasionado por la tecnología. Soporte de redes y sistemas universitarios.',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'Con más de 5 años de experiencia, Juan ha trabajado en proyectos colaborativos de tecnología, desarrollando soluciones eficientes y brindando soporte integral a diversos clientes en la región de Quibdó.',
  },
  {
    id: 'rep5',
    name: 'Sergio Alejandro Agudelo Hoyos',
    description: 'Emprendimeiento de tecnología',
    imageKey: 'sergio',
    category: 'Tecnología',
    rating: 4.8,
    phone: '321 230 7020',
    email: 'sergio@quibdo.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: 'Apasionado por la tecnología. Soporte de redes y sistemas universitarios.',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'Con más de 5 años de experiencia, Juan ha trabajado en proyectos colaborativos de tecnología, desarrollando soluciones eficientes y brindando soporte integral a diversos clientes en la región de Quibdó.',
  },
  {
    id: 'rep6',
    name: 'Tecno Movil',
    description: 'Emprendimeiento de tecnología',
    imageKey: 'tecno',
    category: 'Tecnología',
    rating: 4.8,
    phone: '320 5673783',
    email: '@tecno.movil10',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: 'somos una empresa nueva con muchas gracias de crecer',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'Con nosotros encuentras todo lo relacionado con tecnologia como: celulares, accesorios, computadores y mucho mas (SOMOS UNA TIENDA VIRTUAL)',
  },
  {
    id: 'rep7',
    name: 'Lina Pino',
    description: 'Estetica y belleza',
    imageKey: 'lina',
    category: 'servicios',
    rating: 4.8,
    phone: '320 5673783',
    email: 'lina@gmail.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: '1 año te experiencia ',
    skills: ['Redes', 'Soporte', 'Instalaciones', 'Comunicación'],
    bioLong: 'tengo muy buena comunicacion con el cliente',
  },
  {
    id: 'rep8',
    name: 'Juan Carlos ',
    description: 'Llega a tu lugar seguro',
    imageKey: 'carlos',
    category: 'servicios',
    rating: 4.8,
    phone: '320 5673783',
    email: 'carlos@gmail.com',
    verified: true,
    type: 'Verificado',
    location: 'Quibdó',
    experience: '2 año te experiencia ',
    skills: ['Transporte', 'Facil', 'Seguro', 'Rapido'],
    bioLong: 'LLega a tu destino rapido y seguro ademas realiza tus diligencias conmigo',
  },
  
  // ... más representantes
];

export default function RepresentativeProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [images, setImages] = useState(galleryImages);

  const rep = useMemo(
    () => DATA.find((r) => r.id === id) ?? DATA[0],
    [id]
  );

  // Handler demo para agregar imagen
  const onAddImage = () => {
    // Aquí deberías integrar tu lógica real
    alert('Función de carga de imagen de portafolio pendiente de integrar');
  };

  return (
    <ScrollView style={styles.bg}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={router.back}>
          <Ionicons name="arrow-back" size={22} color="#232323" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        {/* Botón editar (visible solo al dueño del perfil, demo) */}
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="create-outline" size={22} color={AMBER} />
        </TouchableOpacity>
      </View>

      {/* AVATAR Y STATUS */}
      <View style={styles.avatarBox}>
        <Image source={repImages[rep.imageKey]} style={styles.avatar} />
        <View style={styles.verifWrap}>
          {rep.verified && <MaterialCommunityIcons name="check-decagram" color={AMBER} size={20} />}
          <Text style={styles.accountType}>{rep.type || 'Estandar'}</Text>
        </View>
      </View>

      {/* CARD PRINCIPAL */}
      <View style={styles.card}>
        <Text style={styles.name}>{rep.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={AMBER} />
          <Text style={styles.ratingText}>{rep.rating.toFixed(1)}</Text>
          <Text style={styles.category}>{rep.category}</Text>
        </View>
        <Text style={styles.description}>{rep.description}</Text>
        {!!rep.location && (
          <View style={styles.locationBox}>
            <Ionicons name="location-outline" size={15} color="#ce9500" />
            <Text style={{ color: '#ce9500', fontWeight: 'bold', fontSize: 13 }}>{rep.location}</Text>
          </View>
        )}
      </View>

      {/* BIO PROFESIONAL LARGA */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sobre mí</Text>
        <Text style={styles.desc}>{rep.bioLong ?? rep.experience}</Text>
      </View>

      {/* HABILIDADES */}
      {rep.skills?.length ? (
        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsWrap}>
            {rep.skills.map(skill => (
              <View key={skill} style={styles.skillChip}>
                <Ionicons name="checkmark-circle-outline" size={13} color={AMBER} style={{ marginRight: 4 }} />
                <Text style={{ color: '#232323', fontWeight: 'bold', fontSize: 12 }}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* CONTACTO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={styles.rowIcon}>
          <Ionicons name="call-outline" size={19} color={AMBER} />
          <Text style={styles.contact}>{rep.phone}</Text>
        </View>
        <View style={styles.rowIcon}>
          <Ionicons name="mail-outline" size={19} color={AMBER} />
          <Text style={styles.contact}>{rep.email}</Text>
        </View>
      </View>

      {/* PORTAFOLIO (GALERÍA) */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Portafolio</Text>
          <TouchableOpacity style={styles.addPhotoBtn} onPress={onAddImage}>
            <Ionicons name="add-circle" color={AMBER} size={20} />
            <Text style={{ color: AMBER, fontWeight: 'bold', fontSize: 13, marginLeft: 3 }}>Agregar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 7 }}
          keyExtractor={img => String(img.id)}
          renderItem={({ item }) => (
            <View style={styles.imgPreviewWrap}>
              <Image source={item.uri} style={styles.imgPreview} />
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#bbb', fontStyle: 'italic', marginVertical: 9 }}>Sin imágenes aún.</Text>
          }
        />
      </View>

      {/* ACCIONES */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={19} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="calendar-outline" size={19} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="call-outline" size={19} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{ height: 22 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: { fontWeight: 'bold', fontSize: 16, color: '#232323' },
  headerIcon: { padding: 5, borderRadius: 8 },

  avatarBox: { marginTop: 12, marginBottom: 3, alignItems: 'center' },
  avatar: {
    width: 92, height: 92, borderRadius: 46, backgroundColor: '#fff3cf', borderWidth: 3, borderColor: '#fff', elevation: 3,
  },
  verifWrap: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 7, gap: 8,
  },
  accountType: {
    fontSize: 11, backgroundColor: '#FFF6E6', color: '#ba8600',
    paddingHorizontal: 9, paddingVertical: 2, borderRadius: 6, fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 18, marginTop: 14, padding: 16, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 7, shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 20, fontWeight: '700', color: '#232323', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  ratingText: { fontWeight: 'bold', fontSize: 15, color: '#232323' },
  category: {
    fontSize: 12, backgroundColor: '#ffecb3', color: '#ce9500', marginLeft: 12,
    fontWeight: '700', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden',
  },
  description: { color: '#232323', fontSize: 14, marginBottom: 1 },
  locationBox: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, color: '#212121', marginBottom: 3 },
  desc: { color: '#444', fontSize: 14, marginTop: 3 },
  skillsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 2,
  },
  skillsWrap: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 6 },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF6E6',
    borderRadius: 13,
    marginBottom: 3,
  },
  rowIcon: { flexDirection: 'row', alignItems: 'center', marginBottom: 7, gap: 12 },
  contact: { fontSize: 15, color: '#232323' },
  addPhotoBtn: { flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 12, backgroundColor: '#FFFBEA' },
  imgPreviewWrap: {
    marginHorizontal: 3, width: 75, height: 75,
    borderRadius: 11, overflow: 'hidden', elevation: 2, backgroundColor: '#fff',
  },
  imgPreview: { width: '100%', height: '100%', borderRadius: 11 },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 25, marginBottom: 18, marginHorizontal: 30, gap: 5,
  },
  actionBtn: {
    flex: 1, marginHorizontal: 5, backgroundColor: AMBER, borderRadius: 12, alignItems: 'center', paddingVertical: 14, elevation: 2,
  },
});
