import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './signin/signin.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class AuthModule { }
