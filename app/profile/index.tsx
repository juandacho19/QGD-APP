// app/profile/index.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { representatives, repImages } from '../data/mock';

const AMBER = '#F59E0B';
const COLUMNS = 2;
const H_PADDING = 15;
const GAP = 12;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - GAP) / COLUMNS);

type ADName = React.ComponentProps<typeof AntDesign>['name'];
const categories: { name: string; icon: ADName }[] = [
  { name: 'Todos', icon: 'home' },
  { name: 'Servicios', icon: 'tool' },
  { name: 'Tecnología', icon: 'rocket' },
  { name: 'Comercio', icon: 'shopping' },
  { name: 'Educación',   icon: 'book' },
  { name: 'Comida',      icon: 'rest' },
  { name: 'Moda',        icon: 'shopping' },
  { name: 'Transporte',  icon: 'car' },
  { name: 'Hogar',       icon: 'home' },
];

export default function ProfilesListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const list = useMemo(() => {
    const byCategory = selectedCategory === 'Todos' ? representatives : representatives.filter((r) => r.category === selectedCategory);
    const term = search.trim().toLowerCase();
    if (!term) return byCategory;
    return byCategory.filter((r) => [r.name, r.description, r.category].join(' ').toLowerCase().includes(term));
  }, [search, selectedCategory]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={repImages[item.imageKey]} style={styles.image} resizeMode="cover" />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={AMBER} />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={{ padding: 10, flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      </View>

      <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
        <TouchableOpacity style={styles.cta} onPress={() => router.push({ pathname: '/profile/[id]', params: { id: item.id } })}>
          <Text style={styles.ctaText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Representantes</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput style={{ flex: 1, marginLeft: 8 }} placeholder="Buscar por nombre o categoría..." placeholderTextColor="#777" value={search} onChangeText={setSearch} />
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 12 }}
        renderItem={({ item }) => {
          const active = selectedCategory === item.name;
          return (
            <TouchableOpacity onPress={() => setSelectedCategory(item.name)} activeOpacity={0.9} style={[styles.categoryItemMini, { marginRight: 20 }]}>
              <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
                <AntDesign name={item.icon} size={22} color={active ? '#fff' : '#333'} />
              </View>
              <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 24 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: GAP }}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666', marginTop: 24 }}>No se encontraron perfiles</Text>}
      />
    </View>
  );
}

const CARD_RADIUS = 12;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 50, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, elevation: 3, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  searchBar: { borderRadius: 10, backgroundColor: '#f3efff', paddingHorizontal: 12, height: 44, flexDirection: 'row', alignItems: 'center' },

  categoryItemMini: { alignItems: 'center' },
  categoryCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  categoryCircleActive: { backgroundColor: '#ffc107' },
  categoryLabel: { marginTop: 5, fontSize: 12, color: '#333' },
  categoryLabelActive: { fontWeight: 'bold', color: '#ffc107' },

  card: { width: ITEM_WIDTH, backgroundColor: '#fff', borderRadius: CARD_RADIUS, overflow: 'hidden', elevation: 2 },
  imageWrap: { width: '100%', height: 120, position: 'relative' },
  image: { width: '100%', height: '100%' },
  ratingBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, gap: 3 },
  ratingText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  name: { fontWeight: 'bold', fontSize: 14, color: '#000' },
  category: { fontSize: 12, color: AMBER, fontWeight: '600', marginTop: 2 },
  desc: { fontSize: 10, color: '#000', marginTop: 6 },

  cta: { backgroundColor: '#ffc107', paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
