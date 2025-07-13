# Gym Track

Aplicación para seguimiento de entrenamiento en el gimnasio. Permite llevar un control de los pesos de cada ejercicio, medidas corporales y progreso del usuario.

## Tecnologías

### Frontend
- Next.js (React)
- Tailwind CSS (pendiente de implementar)

### Backend
- Express.js
- MongoDB (Atlas)
- Mongoose

## Estructura del Proyecto

```
gym-track/
├── frontend/          # Aplicación Next.js
│   ├── src/
│   │   ├── app/       # Páginas y componentes de la app
│   │   ├── components/# Componentes reutilizables
│   │   └── styles/    # Estilos CSS
│   └── ...
└── backend/           # API con Express.js
    ├── src/
    │   ├── config/    # Configuración
    │   ├── controllers/# Controladores
    │   ├── models/    # Modelos de datos
    │   ├── routes/    # Rutas de la API
    │   └── index.js   # Punto de entrada
    └── ...
```

## Instalación

### Requisitos previos
- Node.js (v14 o superior)
- MongoDB Atlas cuenta (o MongoDB local)

### Configuración

1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd gym-track
```

2. Configurar el backend
```
cd backend
npm install
```
- Crear un archivo `.env` en la carpeta backend con:
```
PORT=5000
MONGODB_URI=tu_uri_de_mongodb_atlas
```

3. Configurar el frontend
```
cd ../frontend
npm install
```

4. Iniciar el desarrollo
```
# En una terminal (backend)
cd backend
npm run dev

# En otra terminal (frontend)
cd frontend
npm run dev
```

## Funcionalidades (por implementar)

- Registro y login de usuarios
- Creación y seguimiento de rutinas de entrenamiento
- Registro de pesos y repeticiones por ejercicio
- Seguimiento de medidas corporales
- Visualización de progreso semanal, mensual y anual
- Estadísticas y gráficos de progreso
