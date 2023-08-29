import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { User } from '../models/user';
import { UserService } from '../user.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import * as jwt from 'jsonwebtoken';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  customOptions: OwlOptions = {
    autoWidth: true,
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: true,
    autoplay: true,
    dots: true,
    navSpeed: 900,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: true
  }

  formLogin: FormGroup
  errorLogin: string = "";
  waitApproval: string = "";
  searchText: string = '';
  doctors: User[] = [];
  filteredDoctors: User[] = [];
  doctorsToDisplay: User[] = [];
  sortAscending: boolean = true;

  constructor(private servis: UserService ,private ruter: Router) {
    this.formLogin = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.servis.getAllDoctors().subscribe((doctors: User[]) => {
      this.doctors = doctors;
      this.updateDisplayedDoctors();
    });
  }

  submitLogin() {
    this.errorLogin = "";
    this.waitApproval = "";
    if (this.formLogin.valid) {
      console.log(this.formLogin.get('username'))
      this.servis.login(this.formLogin.get('username').value, this.formLogin.get('password').value).subscribe((user: User)=>{
        if(!user){
          this.errorLogin = 'Pogresni podaci';
        }
        else if (!user.approved){
          this.waitApproval = 'Cekajte odobrenje';
        }
        else{
          if(user.type=="patient"){
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('first_name', user.first_name);
            sessionStorage.setItem('last_name', user.last_name);
            this.ruter.navigate(['patient']);
          }else if(user.type=="doctor"){
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('first_name', user.first_name);
            sessionStorage.setItem('last_name', user.last_name);
            this.ruter.navigate(['doctor']);
          }
        }
      })
    } else {
      if (this.formLogin.get('username')?.hasError('required')) {
        this.errorLogin = "Korisnicko ime je obavezno polje";
      } else if (this.formLogin.get('password')?.hasError('required')) {
        this.errorLogin = "Lozinka je obavezno polje";
      }
    }
  }

  updateDisplayedDoctors() {
    if (this.searchText === '') {
      console.log(this.doctors[8])
      this.doctorsToDisplay = this.doctors;
    }
  }

  sortDoctors(column: string) {
    this.sortAscending = !this.sortAscending;
    this.filteredDoctors = this.doctors;
    this.filteredDoctors.sort((a, b) => {
      const compareResult = a[column].localeCompare(b[column]);
      return this.sortAscending ? compareResult : -compareResult;
    });
    console.log(this.doctorsToDisplay)
    this.doctorsToDisplay = [...this.filteredDoctors]; 
  }

  filterDoctors() {
    if (!this.searchText) {
      this.filteredDoctors = this.doctors;
      this.doctorsToDisplay = this.doctors;
      return;
    }

    const lowerCaseSearch = this.searchText.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor => {
      return (
        doctor.first_name.toLowerCase().includes(lowerCaseSearch) ||
        doctor.last_name.toLowerCase().includes(lowerCaseSearch) ||
        doctor.specialization.toLowerCase().includes(lowerCaseSearch)
      );
    });
    this.doctorsToDisplay = this.filteredDoctors; // Ažurirajte doctorsToDisplay
  }
}
