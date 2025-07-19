import mongoose from 'mongoose';
import config from '../config/config';

async function initializeDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Obtener la conexión de la base de datos
    const db = mongoose.connection;

    // Configuración de validación para cada colección
    const collectionValidators = {
      users: {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                bsonType: 'string',
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
              },
              password: {
                bsonType: 'string',
                minLength: 6
              },
              name: {
                bsonType: 'string'
              },
              weight: {
                bsonType: 'number'
              },
              height: {
                bsonType: 'number'
              },
              measurements: {
                bsonType: 'object',
                properties: {
                  chest: { bsonType: 'number' },
                  waist: { bsonType: 'number' },
                  hips: { bsonType: 'number' },
                  biceps: { bsonType: 'number' },
                  thighs: { bsonType: 'number' }
                }
              }
            }
          }
        }
      },
      workouts: {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user', 'title', 'exercises'],
            properties: {
              user: {
                bsonType: ['string', 'objectId']
              },
              title: {
                bsonType: 'string'
              },
              exercises: {
                bsonType: 'array',
                items: {
                  bsonType: 'object',
                  required: ['name', 'sets', 'reps', 'day', 'completed'],
                  properties: {
                    name: { bsonType: 'string' },
                    sets: { bsonType: 'number' },
                    reps: { bsonType: 'string' },
                    weight: { bsonType: 'number' },
                    rest: { bsonType: 'string' },
                    muscleGroups: {
                      bsonType: 'array',
                      items: { bsonType: 'string' }
                    },
                    focus: { bsonType: 'string' },
                    completed: { bsonType: 'bool' },
                    day: { bsonType: 'string' }
                  }
                }
              },
              notes: { bsonType: 'string' },
              completed: { bsonType: 'bool' }
            }
          }
        }
      },
      progress: {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['user', 'date', 'weight'],
            properties: {
              user: {
                bsonType: ['string', 'objectId']
              },
              date: {
                bsonType: 'date'
              },
              weight: {
                bsonType: 'number'
              },
              measurements: {
                bsonType: 'object',
                properties: {
                  chest: { bsonType: 'number' },
                  waist: { bsonType: 'number' },
                  hips: { bsonType: 'number' },
                  biceps: { bsonType: 'number' },
                  thighs: { bsonType: 'number' }
                }
              },
              notes: { bsonType: 'string' }
            }
          }
        }
      }
    };

    // Actualizar o crear colecciones con sus validaciones
    for (const [collectionName, validation] of Object.entries(collectionValidators)) {
      try {
        // Intentar obtener la colección existente
        const collections = await db.db.listCollections({ name: collectionName }).toArray();
        
        if (collections.length > 0) {
          // Si la colección existe, actualizar su validación
          await db.db.command({
            collMod: collectionName,
            ...validation
          });
          console.log(`Colección ${collectionName} actualizada con nueva validación`);
        } else {
          // Si la colección no existe, crearla
          await db.createCollection(collectionName, validation);
          console.log(`Colección ${collectionName} creada con validación`);
        }
      } catch (error) {
        console.error(`Error al procesar la colección ${collectionName}:`, error);
        throw error;
      }
    }

    // Crear o actualizar índices
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Índice único creado/actualizado para users.email');

    await db.collection('workouts').createIndex({ user: 1 });
    console.log('Índices creados/actualizados para workouts');

    await db.collection('progress').createIndex({ user: 1 });
    await db.collection('progress').createIndex({ date: 1 });
    console.log('Índices creados/actualizados para progress');

    console.log('Todas las colecciones e índices han sido actualizados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initializeDatabase(); 