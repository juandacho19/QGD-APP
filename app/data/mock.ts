// app/data/mock.ts
export const repImages = {
  juan:   require('../../assets/juan.jpg'),
  juanca: require('../../assets/juanca.jpg'),
  leo:    require('../../assets/Leo.jpg'),
  alzate: require('../../assets/alzate.jpg'),
  sergio: require('../../assets/sergio.jpg'),
  tecno:  require('../../assets/tecno-movil.jpg'),

} as const;

export type Representative = {
  id: string;
  name: string;
  description: string;
  imageKey: keyof typeof repImages;
  category: string;
  rating: number;
};

export const representatives: Representative[] = [
  { id: 'rep1',  name: 'Juan David',       description: 'Estudiante de Ingeniería de Telecomunicaciones', imageKey: 'juan',   category: 'Tecnología',  rating: 4.8 },
  { id: 'rep2',  name: 'Juan carlos',     description: 'Vendedora de Productos Chocoanos',               imageKey: 'juanca', category: 'Comercio',     rating: 4.9 },
  { id: 'rep3',  name: 'Xavier leonardo',         description: 'Técnico de Refrigeración',                       imageKey: 'leo',    category: 'Servicios',    rating: 4.7 },
  { id: 'rep4',  name: 'Jose leandro',    description: 'Diseñadora gráfica freelance',                   imageKey: 'alzate', category: 'Servicios',    rating: 4.6 },
  { id: 'rep5',  name: 'Sergio Agudelo',     description: 'Soporte y redes para pymes',                     imageKey: 'sergio',   category: 'Tecnología',   rating: 4.5 },
  { id: 'rep6',  name: 'Tecno movil ',      description: 'Ventas y atención al cliente',                   imageKey: 'tecno', category: 'Comercio',     rating: 4.8 },
  { id: 'rep7',  name: 'Santiago Gil',     description: 'Mantenimiento de aires acondicionados',          imageKey: 'leo',    category: 'Servicios',    rating: 4.7 },
  { id: 'rep8',  name: 'Valeria Rivas',    description: 'Clases particulares de matemáticas',             imageKey: 'juan',   category: 'Educación',    rating: 4.9 },
  { id: 'rep9',  name: 'Daniel Cuesta',    description: 'Fotógrafo de eventos y productos',               imageKey: 'juanca', category: 'Servicios',    rating: 4.6 },
  { id: 'rep10', name: 'Natalia Mosquera', description: 'Community Manager para negocios locales',        imageKey: 'juan',   category: 'Tecnología',   rating: 4.7 },
  { id: 'rep11', name: 'Esteban Lozano',   description: 'Mensajería y domicilios rápidos',                imageKey: 'leo',    category: 'Transporte',   rating: 4.5 },
  { id: 'rep12', name: 'Laura Córdoba',    description: 'Pastelería artesanal a pedido',                  imageKey: 'juanca', category: 'Comida',       rating: 4.8 },
];

export const jobImages = {
  admin:  require('../../assets/oroexpress.png'),
  bodega: require('../../assets/MERCADIARIO.png'),
  dev:    require('../../assets/comfachoco.png'),
} as const;

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  imageKey: keyof typeof jobImages;
};

export const jobs: Job[] = [
  { id: 'job1',  title: 'Asistente Administrativo', company: 'Empresa X S.A.',  location: 'Quibdó',   salary: '1.8M COP', type: 'Tiempo completo', description: 'Gestión de documentos y atención al cliente.', imageKey: 'admin'  },
  { id: 'job2',  title: 'Operario de Bodega',       company: 'Logística Chocó', location: 'Quibdó',   salary: '1.3M COP', type: 'Medio tiempo',     description: 'Carga y descarga de mercancía.',             imageKey: 'bodega' },
  { id: 'job3',  title: 'Desarrollador Junior',     company: 'Tech Solutions',  location: 'Remoto',   salary: '2.5M COP', type: 'Remoto',           description: 'Desarrollo de nuevas funcionalidades web.', imageKey: 'dev'    },
  { id: 'job4',  title: 'Vendedor de Mostrador',    company: 'Comercial JL',    location: 'Quibdó',   salary: '1.4M COP', type: 'Tiempo completo', description: 'Atención al cliente y cierre de ventas.',     imageKey: 'admin'  },
  { id: 'job5',  title: 'Técnico Electricista',     company: 'Servicios Omega', location: 'Itinerante', salary: '2.0M COP', type: 'Por contrato',   description: 'Instalación y mantenimiento eléctrico.',      imageKey: 'bodega' },
  { id: 'job6',  title: 'Diseñador Gráfico',        company: 'Creativa SAS',    location: 'Remoto',   salary: '2.2M COP', type: 'Remoto',           description: 'Diseño de piezas para redes y branding.',     imageKey: 'dev'    },
  { id: 'job7',  title: 'Mensajero',                company: 'Express Local',   location: 'Quibdó',   salary: '1.5M COP', type: 'Tiempo completo', description: 'Entrega de paquetes y documentación.',          imageKey: 'bodega' },
  { id: 'job8',  title: 'Docente de Matemáticas',   company: 'Colegio Central', location: 'Quibdó',   salary: '2.8M COP', type: 'Tiempo completo', description: 'Clases en secundaria y preparación ICFES.',   imageKey: 'admin'  },
  { id: 'job9',  title: 'Soporte TI',               company: 'NetCare',         location: 'Híbrido',  salary: '2.3M COP', type: 'Híbrido',          description: 'Soporte de usuarios y mantenimiento PCs.',    imageKey: 'dev'    },
  { id: 'job10', title: 'Auxiliar Contable',        company: 'Finanzas Q',      location: 'Quibdó',   salary: '1.9M COP', type: 'Tiempo completo', description: 'Registro contable y conciliaciones.',          imageKey: 'admin'  },
  { id: 'job11', title: 'Cocinero',                 company: 'Sabor Chocoano',  location: 'Quibdó',   salary: '1.8M COP', type: 'Turnos',           description: 'Preparación de platos típicos.',              imageKey: 'bodega' },
  { id: 'job12', title: 'UX/UI Junior',             company: 'Pixel Lab',       location: 'Remoto',   salary: '2.4M COP', type: 'Remoto',           description: 'Wireframes y prototipos de interfaces.',       imageKey: 'dev'    },
];
