import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WORKOUTS_ROUTES } from './workouts.routes';
import { WorkoutsComponent } from './workouts.component';

@NgModule({
  imports: [
    RouterModule.forChild(WORKOUTS_ROUTES)
  ],
  exports: [RouterModule]
})
export class WorkoutsModule { } 