import { PrismaExerciseRepository } from '../repositories/exerciseRepository';
import { ExerciseService } from '../services/exerciseService';
import { IExerciseRepository } from '../types/repositories';

// Contenedor simple de inyección de dependencias
class DIContainer {
  private repositories: Map<string, any> = new Map();
  private services: Map<string, any> = new Map();

  // Registrar repositorios
  registerRepository(name: string, repository: any): void {
    this.repositories.set(name, repository);
  }

  // Registrar servicios
  registerService(name: string, service: any): void {
    this.services.set(name, service);
  }

  // Obtener repositorio
  getRepository<T>(name: string): T {
    const repository = this.repositories.get(name);
    if (!repository) {
      throw new Error(`Repositorio ${name} no encontrado`);
    }
    return repository as T;
  }

  // Obtener servicio
  getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Servicio ${name} no encontrado`);
    }
    return service as T;
  }
}

// Crear instancia del contenedor
const container = new DIContainer();

// Registrar repositorios
container.registerRepository('exerciseRepository', new PrismaExerciseRepository());

// Registrar servicios
container.registerService('exerciseService', new ExerciseService(
  container.getRepository<IExerciseRepository>('exerciseRepository')
));

export default container; 