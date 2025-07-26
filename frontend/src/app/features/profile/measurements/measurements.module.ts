import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MEASUREMENTS_ROUTES } from './measurements.routes';
import { MeasurementsComponent } from './measurements.component';

@NgModule({
  imports: [
    RouterModule.forChild(MEASUREMENTS_ROUTES)
  ],
  exports: [RouterModule]
})
export class MeasurementsModule { } 