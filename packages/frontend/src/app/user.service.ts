import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// How to send http params
    // const params = new HttpParams()
    // params.set('bla', 'vrednost')
    // this.http.get('sad', {params})

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000/users';

  constructor(private http: HttpClient) { }

  login(username, password){
    console.log(username, password)
    const data = {
      username: username,
      password: password
    }
    return this.http.post(`${this.uri}/login`, data);
  }

  register(username, password, firstname, lastname, email, address, phone, profile_picture){
    const data = {
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      email: email,
      address: address,
      phone: phone,
      profile_picture: profile_picture
    }
    console.log(data)
    return this.http.post(`${this.uri}/register`, data);
  }

  getBooks(user) {
    const data = {
      user: user
    }
    return this.http.post(`${this.uri}/getBooks`, data);
  }


  getAllDoctors(){
    return this.http.get(`${this.uri}/getAllDoctors`);
  }

  changePassword(loggedInUsername, oldPassword, newPassword){
    const data = {
      username: loggedInUsername,
      password: oldPassword,
      newPassword: newPassword
    }
    return this.http.post(`${this.uri}/changePassword`, data);
  }

  getLoggedInUser(loggedInUsername){
    const data = {
      username: loggedInUsername
    }
    return this.http.post(`${this.uri}/getLoggedInUser`, data);
  }

  updateUserProfile(loggedInUsername, updatedProfile){

    const data = {
      username: loggedInUsername,
      updatedProfile: updatedProfile
    }
    return this.http.post(`${this.uri}/updateUserProfile`, data);
  }

  findAppointment(doctor, date){

    const data = {
      doctor: doctor.username,
      date: date
    }
    return this.http.post(`${this.uri}/findAppointment`, data);
  }

  bookAppointment(doctor, patient, date, appointment){
    console.log(doctor.username)
    const data = {
      doctor: doctor.username,
      patient: patient,
      date: date,
      appointment: appointment
    }
    return this.http.post(`${this.uri}/bookAppointment`, data);
  }

  getBookedAppointments(user){
    const data = {
      user:user
    }
    console.log(data)
    return this.http.post(`${this.uri}/getBookedAppointments`, data);
  }
}
