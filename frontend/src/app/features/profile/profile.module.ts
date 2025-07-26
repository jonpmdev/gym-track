import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PROFILE_ROUTES } from './profile.routes';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    RouterModule.forChild(PROFILE_ROUTES)
  ],
  exports: [RouterModule]
})
export class ProfileModule { } 