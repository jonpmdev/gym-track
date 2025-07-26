import { Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts.component';

export const WORKOUTS_ROUTES: Routes = [
  {
    path: '',
    component: WorkoutsComponent
  },
  {
    path: ':id',
    component: WorkoutsComponent
  },
  {
    path: ':id/progress',
    loadChildren: () => import('./progress/progress.module').then(m => m.ProgressModule)
  }
]; 