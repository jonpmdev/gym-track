# Gym Track

Aplicación para seguimiento de entrenamiento en el gimnasio. Permite llevar un control de los pesos de cada ejercicio, medidas corporales y progreso del usuario.

## Tecnologías

### Frontend
- Next.js 14 (React)
- Tailwind CSS
- TypeScript

### Backend
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT para autenticación
- TypeScript

## Estructura del Proyecto

```
gym-track/
├── frontend/          # Aplicación Next.js
│   ├── src/
│   │   ├── app/      # Páginas de la aplicación
│   │   │   ├── login/      # Página de inicio de sesión
│   │   │   ├── register/   # Página de registro
│   │   │   ├── dashboard/  # Panel principal
│   │   │   └── workouts/   # Gestión de entrenamientos
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── DashboardLayout.tsx  # Layout principal
│   │   │   └── WorkoutForm.tsx      # Formulario de entrenamientos
│   │   └── types/         # Definiciones de tipos TypeScript
│   └── ...
└── backend/           # API con Express.js
    ├── src/
    │   ├── config/    # Configuración
    │   ├── controllers/
    │   │   ├── authController.ts    # Control de autenticación
    │   │   └── workoutController.ts # Control de entrenamientos
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
- MongoDB Atlas cuenta (o MongoDB local)
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
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
```

3. Configurar el frontend
```bash
cd ../frontend
npm install
```

4. Iniciar el desarrollo
```bash
# En una terminal (backend)
cd backend
npm run dev

# En otra terminal (frontend)
cd frontend
npm run dev
```

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
- ✅ Diseño responsive con Tailwind CSS
- ✅ Layout principal con navegación intuitiva
- ✅ Dashboard informativo
- ✅ Navegación protegida
- ✅ Botón de cierre de sesión
- ✅ Interfaz en español
- ✅ Estilos modulares por componente [[memory:3119071]]

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

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
