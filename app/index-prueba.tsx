import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';

// ---------- ICONOS ----------
type ADName = React.ComponentProps<typeof AntDesign>['name'];

// ---------- CATEGORÍAS ----------
const categories: { name: string; icon: ADName }[] = [
  { name: 'Servicios',   icon: 'tool' },
  { name: 'Tecnología',  icon: 'rocket' },
  { name: 'Educación',   icon: 'book' },
  { name: 'Comida',      icon: 'rest' },
  { name: 'Moda',        icon: 'shopping' },
  { name: 'Transporte',  icon: 'car' },
  { name: 'Hogar',       icon: 'home' },
];

// ---------- REPRESENTANTES (imágenes locales en ../assets/) ----------
const repImages = {
  juan:   require('../assets/juan.jpg'),
  juanca: require('../assets/juanca.jpg'),
  leo:    require('../assets/Leo.jpg'),
} as const;

type Representative = {
  id: string;
  name: string;
  description: string;
  imageKey: keyof typeof repImages;
  category: string;
};

const representatives: Representative[] = [
  { id: 'rep1', name: 'Juan David',  description: 'Estudiante de Ingeniería de Telecomunicaciones', imageKey: 'juan',   category: 'Tecnología' },
  { id: 'rep2', name: 'Andrea López',description: 'Vendedora de Productos Chocoanos',               imageKey: 'juanca', category: 'Comercio' },
  { id: 'rep3', name: 'Leo Mena',    description: 'Técnico de Refrigeración',                       imageKey: 'leo',    category: 'Servicios' },
];

// ---------- VACANTES (tus datos “mockJobs” adaptados al diseño) ----------
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
};

const jobs: Job[] = [
  {
    id: '1',
    title: 'Desarrollador React Native',
    company: 'Tech Solutions',
    location: 'Remoto',
    salary: '$3000 - $5000',
    type: 'Tiempo completo',
    description: 'Buscamos desarrollador con experiencia en React Native y TypeScript.',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Digital Agency',
    location: 'Bogotá, Colombia',
    salary: '$2500 - $4000',
    type: 'Tiempo completo',
    description: 'Experiencia en React, CSS y diseño responsive.',
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'StartUp Inc',
    location: 'Híbrido',
    salary: '$4000 - $6000',
    type: 'Tiempo completo',
    description: 'Node.js, React, PostgreSQL. Ambiente dinámico y colaborativo.',
  },
  {
    id: '4',
    title: 'Mobile Developer',
    company: 'App Masters',
    location: 'Remoto',
    salary: '$3500 - $5500',
    type: 'Freelance',
    description: 'Desarrollo de aplicaciones móviles nativas y multiplataforma.',
  },
];

// ---------- PANTALLA ----------
export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  const filteredJobs = jobs.filter((job) =>
    [job.title, job.company, job.location, job.type]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <StatusBar barStyle="dark-content" />

      {/* Encabezado + Búsqueda */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quibdó Guía Dorada</Text>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput
            style={{ flex: 1, marginLeft: 8 }}
            placeholder="Buscar..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={(it) => it.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItemMini}
              onPress={() => setSelectedCategory(item.name)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryCircle,
                  selectedCategory === item.name && styles.categoryCircleActive,
                ]}
              >
                <AntDesign
                  name={item.icon}
                  size={24}
                  color={selectedCategory === item.name ? '#fff' : '#333'}
                />
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === item.name && styles.categoryLabelActive,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Representantes */}
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>Representantes</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ color: '#FFD600', fontWeight: '600' }}>Ver Más</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={representatives}
        keyExtractor={(it) => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View style={stylesMini.repCard}>
            <Image source={repImages[item.imageKey]} style={stylesMini.repImage} resizeMode="cover" />
            <View style={stylesMini.repContent}>
              <Text style={stylesMini.repName}>{item.name}</Text>
              <Text style={stylesMini.repDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={stylesMini.repActions}>
              <TouchableOpacity style={stylesMini.repCta} onPress={() => {}}>
                <Text style={stylesMini.repCtaLabel}>Ver Más</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        getItemLayout={(_, index) => ({ length: 165, offset: 165 * index, index })}
      />

      {/* Vacantes */}
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>Vacantes de Empleo</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ color: '#FFD600', fontWeight: '600' }}>Ver Más</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredJobs}
        keyExtractor={(it) => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ width: 300, marginRight: 15 }}>
            <View style={styles.jobCard}>
              {/* Banner de la vacante (imagen local genérica) */}
              <Image source={require('../assets/juanca.jpg')} style={{ width: '100%', height: 110 }} />
              <View style={{ padding: 12 }}>
                <View style={styles.jobBrandRow}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#FFE082',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="briefcase-outline" size={20} color="#333" />
                  </View>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <View style={styles.jobHeader}>
                      <Text style={styles.jobCompany}>{item.company}</Text>
                      <Text style={styles.jobLocation}>
                        <Ionicons name="location-outline" size={14} color="#666" /> {item.location}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.jobDescription}>{item.description.slice(0, 70)}...</Text>
                <View style={styles.jobTagsContainer}>
                  <Text style={styles.jobTag}>{item.type}</Text>
                </View>
              </View>

              <View style={[styles.jobActions, { padding: 12 }]}>
                <Text style={styles.jobSalary}>
                  <Ionicons name="cash-outline" size={16} color="#ffd900" /> {item.salary}
                </Text>
                <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#ffc400', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Postular</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

// ---------- ESTILOS ----------
const stylesMini = StyleSheet.create({
  repCard: {
    width: 150,
    height: 250,
    marginRight: 15,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  repImage: { width: '100%', height: 120 },
  repContent: { flex: 1, justifyContent: 'space-between', padding: 10 },
  repName: { fontWeight: 'bold', fontSize: 14, color: '#000' },
  repDesc: { fontSize: 10, color: '#000', marginTop: 4 },
  repActions: { justifyContent: 'center', paddingBottom: 10, alignItems: 'center' },
  repCta: { backgroundColor: '#ffc107', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, width: '80%' },
  repCtaLabel: { color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 3,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  searchBar: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#f3efff',
    paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  categoryItemMini: { alignItems: 'center', marginRight: 20 },
  categoryCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCircleActive: { backgroundColor: '#ffc107' },
  categoryLabel: { marginTop: 5, fontSize: 12, color: '#333' },
  categoryLabelActive: { fontWeight: 'bold', color: '#ffc107' },

  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  jobCard: {
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  jobBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  jobCompany: { color: '#FFD600', fontWeight: '600' },
  jobLocation: { fontSize: 13, color: '#666' },
  jobDescription: { fontSize: 13, color: '#555', marginBottom: 10 },
  jobTagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 },
  jobTag: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 6,
    fontSize: 11,
    color: '#666',
  },
  jobActions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobSalary: { fontWeight: 'bold', color: '#e9be00ff', fontSize: 15 },
});
