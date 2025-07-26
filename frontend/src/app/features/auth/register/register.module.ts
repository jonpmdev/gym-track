import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { REGISTER_ROUTES } from './register.routes';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    RouterModule.forChild(REGISTER_ROUTES)
  ],
  exports: [RouterModule]
})
export class RegisterModule { } 