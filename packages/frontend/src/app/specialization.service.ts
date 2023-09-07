import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {

  uri = 'http://localhost:4000/specializations';

  constructor(private http: HttpClient) { }

  getAllSpecializations(){
    return this.http.get(`${this.uri}/getAllSpecializations`);
  }

  addSpecialization(name, branch){
    const data = {
      name:name,
      branch:branch
    }
    return this.http.post(`${this.uri}/addSpecialization`, data);
  }

  deleteAppointment(appointment, specialization){
    const data = {
      appointment:appointment,
      specialization:specialization
    }
    return this.http.post(`${this.uri}/deleteAppointment`, data);
  }

  changeAppointment(appointment, specialization, oldAppointment){
    const data = {
      appointment:appointment,
      specialization:specialization.name,
      oldAppointment: oldAppointment
    }


    return this.http.post(`${this.uri}/changeAppointment`, data);
  }

  createAppointment(specialization, appointment){
    const data = {
      specialization:specialization.name,
      appointment:appointment
    }
    return this.http.post(`${this.uri}/createAppointment`, data);
  }
}
