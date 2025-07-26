# Gym Track

Aplicación para seguimiento de entrenamiento en el gimnasio. Permite llevar un control de los pesos de cada ejercicio, medidas corporales y progreso del usuario.

## Tecnologías

### Frontend
- Angular
- SCSS
- TypeScript

### Backend
- Express.js
- PostgreSQL (Supabase)
- Prisma ORM
- JWT para autenticación
- TypeScript

## Estructura del Proyecto

```
gym-track/
├── frontend/          # Aplicación Angular
│   ├── src/
│   │   ├── app/       # Código principal
│   │   │   ├── core/        # Servicios singleton, modelos, guards, interceptores
│   │   │   ├── shared/      # Componentes, pipes y directivas reutilizables
│   │   │   ├── features/    # Módulos funcionales (auth, workouts, profile, etc.)
│   │   │   └── layout/      # Componentes de estructura (header, footer, etc.)
│   │   ├── assets/          # Recursos estáticos
│   │   └── environments/    # Configuraciones de entorno
│   └── ...
└── backend/           # API con Express.js
    ├── prisma/        # Configuración de Prisma ORM
    │   └── schema.prisma  # Esquema de la base de datos
    ├── src/
    │   ├── config/    # Configuración
    │   │   ├── config.ts      # Variables de entorno
    │   │   ├── prisma.ts      # Cliente de Prisma
    │   │   └── supabase.ts    # Cliente de Supabase
    │   ├── controllers/
    │   │   ├── authController.ts    # Control de autenticación
    │   │   └── workoutController.ts # Control de entrenamientos
    │   ├── generated/  # Código generado por Prisma
    │   ├── middleware/
    │   │   └── auth.ts    # Middleware de autenticación
    │   ├── models/    # Modelos de datos
    │   │   ├── userModel.ts
    │   │   ├── workoutModel.ts
    │   │   └── progressModel.ts
    │   ├── routes/    # Rutas de la API
    │   │   ├── authRoutes.ts
    │   │   └── workoutRoutes.ts
    │   └── index.ts   # Punto de entrada
    └── ...
```

## Instalación

### Requisitos previos
- Node.js (v18 o superior)
- PostgreSQL (local o en Supabase)
- Git

### Configuración

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd gym-track
```

2. Configurar el backend
```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta backend con:
```env
PORT=5000
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gymtrack"
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_anon_de_supabase
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
```

3. Generar el cliente Prisma e inicializar la base de datos
```bash
npx prisma generate
npx prisma db push
npm run initdb
```

4. Configurar el frontend
```bash
cd ../frontend
npm install
```

5. Iniciar el desarrollo
```bash
# En una terminal (backend)
cd backend
npm run dev

# En otra terminal (frontend)
cd frontend
ng serve
```

## Principios SOLID Aplicados

- **Single Responsibility**: Cada componente y servicio tiene una única responsabilidad.
- **Open/Closed**: La estructura permite extender funcionalidades sin modificar código existente.
- **Liskov Substitution**: Los componentes se diseñaron para ser intercambiables.
- **Interface Segregation**: Se utilizan interfaces específicas en lugar de generales.
- **Dependency Inversion**: Se inyectan dependencias en lugar de crearlas dentro de los componentes.

## Optimizaciones de Rendimiento

- Lazy loading para módulos
- Precarga de módulos para mejorar la experiencia de navegación
- Optimización de metadatos para SEO
- Carga eficiente de fuentes

## Funcionalidades Implementadas

### Autenticación
- ✅ Registro de usuarios con email y contraseña
- ✅ Inicio de sesión seguro
- ✅ Protección de rutas con middleware de autenticación
- ✅ Gestión de tokens JWT con expiración
- ✅ Validación de formularios en backend
- ✅ Manejo de errores personalizado

### Entrenamientos
- ✅ Crear nuevo entrenamiento
- ✅ Listar entrenamientos del usuario (ordenados por fecha)
- ✅ Ver detalles de un entrenamiento específico
- ✅ Actualizar entrenamientos existentes
- ✅ Eliminar entrenamientos
- ✅ Validación de datos en backend

### Interfaz de Usuario
- ✅ Diseño responsive
- ✅ Layout principal con navegación intuitiva
- ✅ Dashboard informativo
- ✅ Navegación protegida
- ✅ Botón de cierre de sesión
- ✅ Interfaz en español
- ✅ Estilos modulares por componente [[memory:3119071]]
- ✅ Formularios reactivos

## Funcionalidades Pendientes

### Progreso y Medidas
- [ ] Implementar endpoints de progreso
- [ ] Integrar modelo de progreso existente
- [ ] Formulario de registro de medidas
- [ ] Vista de historial de medidas
- [ ] Gráficos de progreso
- [ ] Exportación de datos de progreso

### Entrenamientos
- [ ] Búsqueda y filtrado de entrenamientos
- [ ] Categorización de ejercicios
- [ ] Plantillas de entrenamiento
- [ ] Historial de pesos por ejercicio
- [ ] Notas por entrenamiento
- [ ] Tiempo de descanso entre series

### Usuario
- [ ] Perfil de usuario completo
- [ ] Foto de perfil
- [ ] Preferencias de entrenamiento
- [ ] Objetivos personalizados
- [ ] Estadísticas personalizadas
- [ ] Recuperación de contraseña

### Estadísticas
- [ ] Dashboard con resumen general
- [ ] Gráficos de volumen de entrenamiento
- [ ] Análisis de progresión de pesos
- [ ] Frecuencia de entrenamiento
- [ ] Tiempo total de entrenamiento
- [ ] Exportación de estadísticas

### Otras Mejoras
- [ ] Implementar PWA (Progressive Web App)
- [ ] Añadir más pruebas unitarias y de integración

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Entrenamientos
- `GET /api/workouts` - Obtener todos los entrenamientos
- `GET /api/workouts/:id` - Obtener un entrenamiento específico
- `POST /api/workouts` - Crear nuevo entrenamiento
- `PUT /api/workouts/:id` - Actualizar entrenamiento
- `DELETE /api/workouts/:id` - Eliminar entrenamiento

## Base de Datos

### Estructura de Tablas en PostgreSQL (gestionado por Prisma)

#### users
- `id` (UUID, PK) - Identificador único del usuario
- `email` (VARCHAR, UNIQUE) - Correo electrónico
- `password` (VARCHAR) - Contraseña encriptada
- `name` (VARCHAR) - Nombre del usuario
- `weight` (DECIMAL) - Peso del usuario
- `height` (DECIMAL) - Altura del usuario
- `measurements` (JSONB) - Medidas corporales
- `created_at` (TIMESTAMP) - Fecha de creación
- `updated_at` (TIMESTAMP) - Fecha de actualización

#### workouts
- `id` (UUID, PK) - Identificador único del entrenamiento
- `user_id` (UUID, FK) - Referencia al usuario
- `title` (VARCHAR) - Título del entrenamiento
- `exercises` (JSONB) - Array de ejercicios
- `notes` (TEXT) - Notas adicionales
- `completed` (BOOLEAN) - Estado de completitud
- `created_at` (TIMESTAMP) - Fecha de creación
- `updated_at` (TIMESTAMP) - Fecha de actualización

#### progress
- `id` (UUID, PK) - Identificador único del registro de progreso
- `user_id` (UUID, FK) - Referencia al usuario
- `date` (TIMESTAMP) - Fecha del registro
- `weight` (DECIMAL) - Peso registrado
- `measurements` (JSONB) - Medidas corporales
- `notes` (TEXT) - Notas adicionales
- `created_at` (TIMESTAMP) - Fecha de creación
- `updated_at` (TIMESTAMP) - Fecha de actualización

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
