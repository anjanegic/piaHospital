import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { User } from '../models/user';
import { UserService } from '../user.service';
//import { passwordValidator } from './validators/passwordValidator';

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

  form: FormGroup
  error: string = "";
  // passwordErrors: {[key: string]: string} = {
  //   pattern: "Password must be in valid form.",
  //   passwordRequirements: "Lozinka ne ispunjava zahteve.",
  //   repeatingCharacters: "Lozinka ne sme sadržati ponavljajuće karaktere."
  // };

  constructor(private servis: UserService ,private ruter: Router) {
    this.form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  }

  ngOnInit(): void {

  }

  submit() {
    this.error = "";
    if (this.form.valid) {
      console.log(this.form.get('username'))
      this.servis.login(this.form.get('username').value, this.form.get('password').value).subscribe((user: User)=>{
        if(!user){
          this.error = 'Wrong credentials.';
        }
        else{
          if(user.type=="patient"){
            this.ruter.navigate(['patient']);
          }else{
            this.ruter.navigate(['doctor']);
          }
        }
      })



    } else {
      if (this.form.get('username')?.hasError('required')) {
        this.error = "Username is required.";
      } else if (this.form.get('password')?.hasError('required')) {
        this.error = "Password is required.";
      }

      // const passwordControl = this.form.get('password');

      // if (passwordControl?.hasError('pattern')) {
      //   this.error = this.passwordErrors['pattern'];
      // } else if (passwordControl?.hasError('passwordRequirements')) {
      //   this.error = this.passwordErrors['passwordRequirements'];
      // } else if (passwordControl?.hasError('repeatingCharacters')) {
      //   this.error = this.passwordErrors['repeatingCharacters'];
      // }
    }
  }

}
