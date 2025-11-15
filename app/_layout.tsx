import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AMBER = '#ffc107';
const INACTIVE = '#BDBDBD';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AMBER,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 65,
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
        tabBarIconStyle: { marginTop: 8 },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "heart" : "heart-outline"} size={26} color={color} />
        }}
      />
      <Tabs.Screen
        name="pantalla_principal"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "home" : "home-outline"} size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vacantes"
        options={{
          title: 'Vacantes',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
