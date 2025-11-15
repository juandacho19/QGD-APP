// app/jobs/index.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { jobs, jobImages } from '../data/mock';

const AMBER = '#ffc107';
const YELLOW_TEXT = '#FFD600';
const GREEN = '#10B981';

export default function JobsListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return jobs;
    return jobs.filter((j) => [j.title, j.company, j.location, j.type].join(' ').toLowerCase().includes(term));
  }, [search]);

  const renderItem = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobBannerContainer}>
        <Image source={jobImages[item.imageKey]} style={{ width: '100%', height: 110 }} />
        <View style={styles.jobTypeTag}>
          <Text style={styles.jobTypeText}>{item.type}</Text>
        </View>
      </View>

      <View style={{ padding: 12 }}>
        <View style={styles.jobBrandRow}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFE082', alignItems: 'center', justifyContent: 'center' }}>
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
          <Ionicons name="cash-outline" size={16} color={GREEN} /> {item.salary}
        </Text>
        <TouchableOpacity activeOpacity={0.85} style={{ backgroundColor: AMBER, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Postular</Text>
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
          <Text style={styles.headerTitle}>Vacantes de Empleo</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput
            style={{ flex: 1, marginLeft: 8 }}
            placeholder="Buscar por cargo, empresa o ubicación..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 24, paddingTop: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666', marginTop: 24 }}>No se encontraron vacantes</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 50, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, elevation: 3, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  searchBar: { borderRadius: 10, backgroundColor: '#f3efff', paddingHorizontal: 12, height: 44, flexDirection: 'row', alignItems: 'center' },

  jobCard: { elevation: 2, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  jobBannerContainer: { position: 'relative', width: '100%', height: 110 },
  jobTypeTag: { position: 'absolute', top: 10, right: 10, backgroundColor: AMBER, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  jobTypeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  jobBrandRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  jobCompany: { color: '#FFD600', fontWeight: '600' },
  jobLocation: { fontSize: 13, color: '#666' },
  jobDescription: { fontSize: 13, color: '#555', marginBottom: 10 },
  jobActions: { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', marginTop: 5, flexDirection: 'row', alignItems: 'center' },
  jobSalary: { fontWeight: 'bold', color: '#10B981', fontSize: 15 },
});
