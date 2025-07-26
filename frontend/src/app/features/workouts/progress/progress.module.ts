import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PROGRESS_ROUTES } from './progress.routes';
import { ProgressComponent } from './progress.component';

@NgModule({
  imports: [
    RouterModule.forChild(PROGRESS_ROUTES)
  ],
  exports: [RouterModule]
})
export class ProgressModule { } 