import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'measurements',
    loadChildren: () => import('./measurements/measurements.module').then(m => m.MeasurementsModule)
  }
]; 