import React, { useState } from 'react';
import {
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
import { Link } from 'expo-router';
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
  alzate: require('../assets/alzate.jpg'),
  sergio: require('../assets/sergio.jpg'),
  tecno:  require('../assets/tecno-movil.jpg'), 
  lina:  require('../assets/lina.jpg'),
  carlos:  require('../assets/carlos.jpg'),
} as const;

type Representative = {
  id: string;
  name: string;
  description: string;
  imageKey: keyof typeof repImages;
  category: string;
  rating: number;
};

const representatives: Representative[] = [
  { id: 'rep1',  name: 'Juan David',       description: 'Estudiante de Ingeniería de Telecomunicaciones', imageKey: 'juan',   category: 'Tecnología',  rating: 4.8 },
  { id: 'rep2',  name: 'Juan Carlos',     description: 'Vendedor de Productos Chocoanos',               imageKey: 'juanca', category: 'Comercio',     rating: 4.9 },
  { id: 'rep3',  name: 'Xvier leonardo',         description: 'Técnico de Refrigeración',                       imageKey: 'leo',    category: 'Servicios',    rating: 4.7 },
  { id: 'rep4',  name: 'Jose Leando',    description: 'Estudiate de Telecomunicaciones',                   imageKey: 'alzate', category: 'Servicios',    rating: 4.6 },
  { id: 'rep5',  name: 'Sergio Agudelo',     description: 'Soporte y redes para pymes',                     imageKey: 'sergio',   category: 'Tecnología',   rating: 4.5 },
  { id: 'rep6',  name: 'Tecno Movil Quibdó',      description: 'Venta de productos tecnológicos',         imageKey: 'tecno', category: 'Comercio',     rating: 4.8 },
  { id: 'rep7',  name: 'Lina Pino',     description: 'Estilista y profesional de belleza',          imageKey: 'lina',    category: 'Servicios',    rating: 4.7 },
  { id: 'rep8',  name: 'Juan Carlos',    description: 'Rapimotero',             imageKey: 'carlos',   category: 'Transporte',    rating: 4.9 },
  { id: 'rep9',  name: 'Daniel Cuesta',    description: 'Fotógrafo de eventos y productos',               imageKey: 'juanca', category: 'Servicios',    rating: 4.6 },
  { id: 'rep10', name: 'Natalia Mosquera', description: 'Community Manager para negocios locales',        imageKey: 'juan',   category: 'Tecnología',   rating: 4.7 },
  { id: 'rep11', name: 'Esteban Lozano',   description: 'Mensajería y domicilios rápidos',                imageKey: 'leo',    category: 'Transporte',   rating: 4.5 },
  { id: 'rep12', name: 'Laura Córdoba',    description: 'Pastelería artesanal a pedido',                  imageKey: 'juanca', category: 'Comida',       rating: 4.8 },
];

// ---------- VACANTES (mock ampliado) ----------
const jobImages = {
  admin:  require('../assets/oroexpress.png'),
  bodega: require('../assets/MERCADIARIO.png'),
  dev:    require('../assets/comfachoco.png'),
} as const;

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  imageKey: keyof typeof jobImages;
};

const jobs: Job[] = [
  { id: 'job1',  title: 'Asistente Administrativo', company: 'Empresa X S.A.',  location: 'Quibdó',           salary: '1.8M COP', type: 'Tiempo completo', description: 'Gestión de documentos y atención al cliente.', imageKey: 'admin'  },
  { id: 'job2',  title: 'Operario de Bodega',       company: 'Logística Chocó', location: 'Quibdó',           salary: '1.3M COP', type: 'Medio tiempo',     description: 'Carga y descarga de mercancía.',             imageKey: 'bodega' },
  { id: 'job3',  title: 'Desarrollador Junior',     company: 'Tech Solutions',  location: 'Remoto',           salary: '2.5M COP', type: 'Remoto',           description: 'Desarrollo de nuevas funcionalidades web.', imageKey: 'dev'    },
  { id: 'job4',  title: 'Vendedor de Mostrador',    company: 'Comercial JL',    location: 'Quibdó',           salary: '1.4M COP', type: 'Tiempo completo', description: 'Atención al cliente y cierre de ventas.',     imageKey: 'admin'  },
  { id: 'job5',  title: 'Técnico Electricista',     company: 'Servicios Omega', location: 'Itinerante',       salary: '2.0M COP', type: 'Por contrato',     description: 'Instalación y mantenimiento eléctrico.',      imageKey: 'bodega' },
  { id: 'job6',  title: 'Diseñador Gráfico',        company: 'Creativa SAS',    location: 'Remoto',           salary: '2.2M COP', type: 'Remoto',           description: 'Diseño de piezas para redes y branding.',     imageKey: 'dev'    },
  { id: 'job7',  title: 'Mensajero',                company: 'Express Local',   location: 'Quibdó',           salary: '1.5M COP', type: 'Tiempo completo', description: 'Entrega de paquetes y documentación.',          imageKey: 'bodega' },
  { id: 'job8',  title: 'Docente de Matemáticas',   company: 'Colegio Central', location: 'Quibdó',           salary: '2.8M COP', type: 'Tiempo completo', description: 'Clases en secundaria y preparación ICFES.',   imageKey: 'admin'  },
  { id: 'job9',  title: 'Soporte TI',               company: 'NetCare',         location: 'Híbrido',          salary: '2.3M COP', type: 'Híbrido',          description: 'Soporte de usuarios y mantenimiento PCs.',    imageKey: 'dev'    },
  { id: 'job10', title: 'Auxiliar Contable',        company: 'Finanzas Q',      location: 'Quibdó',           salary: '1.9M COP', type: 'Tiempo completo', description: 'Registro contable y conciliaciones.',          imageKey: 'admin'  },
  { id: 'job11', title: 'Cocinero',                 company: 'Sabor Chocoano',  location: 'Quibdó',           salary: '1.8M COP', type: 'Turnos',           description: 'Preparación de platos típicos.',              imageKey: 'bodega' },
  { id: 'job12', title: 'UX/UI Junior',             company: 'Pixel Lab',       location: 'Remoto',           salary: '2.4M COP', type: 'Remoto',           description: 'Wireframes y prototipos de interfaces.',       imageKey: 'dev'    },
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
        <Text style={styles.sectionTitle}>Aspirantes</Text>
        <Link href="/profile" asChild>
          <TouchableOpacity>
            <Text style={{ color: '#FFD600', fontWeight: '600' }}>Ver Más</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={representatives}
        keyExtractor={(it) => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View style={stylesMini.repCard}>
            <View style={stylesMini.repImageWrapper}>
              <Image source={repImages[item.imageKey]} style={stylesMini.repImage} resizeMode="cover" />
              {/* Badge de puntuación */}
              <View style={stylesMini.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFD600" />
                <Text style={stylesMini.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <View style={stylesMini.repContent}>
              <Text style={stylesMini.repName}>{item.name}</Text>
              <Text style={stylesMini.repCategory}>{item.category}</Text>
              <Text style={stylesMini.repDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={stylesMini.repActions}>
              <Link
                href={{ pathname: '/profile/[id]', params: { id: item.id } }}
                asChild
              >
                <TouchableOpacity style={stylesMini.repCta}>
                  <Text style={stylesMini.repCtaLabel}>Ver Más</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}
        getItemLayout={(_, index) => ({ length: 165, offset: 165 * index, index })}
      />

      {/* Vacantes */}
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionTitle}>Vacantes de Empleo</Text>
        <Link href="/jobs" asChild>
          <TouchableOpacity>
            <Text style={{ color: '#FFD600', fontWeight: '600' }}>Ver Más</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={filteredJobs}
        keyExtractor={(it) => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/jobs/[id]', params: { id: item.id } }} asChild>
            <TouchableOpacity style={{ width: 300, marginRight: 15 }}>
              <View style={styles.jobCard}>
                {/* Banner de la vacante */}
                <View style={styles.jobBannerContainer}>
                  <Image source={jobImages[item.imageKey]} style={{ width: '100%', height: 110 }} />
                  <View style={styles.jobTypeTag}>
                    <Text style={styles.jobTypeText}>{item.type}</Text>
                  </View>
                </View>
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
                </View>
                <View style={[styles.jobActions, { padding: 12 }]}>
                  <Text style={styles.jobSalary}>
                    <Ionicons name="cash-outline" size={16} color="#10B981" /> {item.salary}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ backgroundColor: '#ffc400', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Postular</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </ScrollView>
  );
}

// Los styles... (igual que los tuyos, sin cambios)
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
  repImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  repImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  repContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  repName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  repDesc: {
    fontSize: 10,
    color: '#000',
    marginTop: 4,
  },
  repActions: {
    justifyContent: 'center',
    paddingBottom: 10,
    alignItems: 'center',
  },
  repCta: {
    backgroundColor: '#ffc107',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: '80%',
  },
  repCategory: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 6,
  },
  repCtaLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
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
  jobBannerContainer: {
    position: 'relative',
    width: '100%',
    height: 110,
  },
  jobTypeTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  jobTypeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
  jobActions: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobSalary: {
    fontWeight: 'bold',
    color: '#10B981',
    fontSize: 15,
  },
});

