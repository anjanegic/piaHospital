import { RouterModule, Routes, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { DoctorComponent } from './doctor/doctor.component';
import { LoginComponent } from './login/login.component';
import { PatientComponent } from './patient/patient.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: "", component: LoginComponent, title: "Dobrodošli" },
  { path: "register", component: RegisterComponent, title: "Dobrodošli" },
  { path: "patient", component: PatientComponent, title: "Pacijent"},
  { path: "doctor", component: DoctorComponent, title: "Doktor"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
