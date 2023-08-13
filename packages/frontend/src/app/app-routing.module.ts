import { RouterModule, Routes, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { DoctorComponent } from './doctor/doctor.component';
import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: "", component: LoginComponent, title: 'Welcome' },
  { path: "patient", component: PatientComponent, title: "Patient"},
  { path: "doctor", component: DoctorComponent, title: "Doctor"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
