import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { passwordValidator } from '../validators/passwordValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister: FormGroup
  errorLogin: string = "";
  waitApproval: string = "";
  errorRegister: string = "";
  registerSuccess: string = "";
  passwordErrors: {[key: string]: string} = {
    passwordRequirements: "Password must be between 8 and 14 characters, have 1 uppercase character, 1 number, 1 special character and start with a letter!",
    repeatingCharacters: "Password must not contain repeating characters."
  };
  selectedFile: File | null = null;

  constructor(private servis: UserService ,private ruter: Router) {

    this.formRegister = new FormGroup({
      usernameRegister: new FormControl('', Validators.required),
      passwordRegister: new FormControl('', [Validators.required, passwordValidator()]),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9+_.-]+@(.+)$")]),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      profilePicture: new FormControl('')
    });

  }

  ngOnInit(): void {
  }



  submitRegister() {
    this.errorRegister = "";
    if (this.formRegister.valid) {
      let profilePicture = (this.formRegister.get('profilePicture').value) ? this.getImageUrl(this.formRegister.get('profilePicture').value): "../../../frontend/src/assets/profile-icon-person-user-19.png";
      let username = this.formRegister.get('usernameRegister').value;
      let password = this.formRegister.get('passwordRegister').value;
      let firstname = this.formRegister.get('firstname').value;
      let lastname = this.formRegister.get('lastname').value;
      let email = this.formRegister.get('email').value;
      let address = this.formRegister.get('address').value;
      let phone = this.formRegister.get('phone').value;

      this.servis.register(username, password, firstname, lastname, email, address, phone, profilePicture).subscribe((respObj)=>{
        if(respObj['message']=='ok'){
          this.registerSuccess = 'You are registered';
        }
        else{
          this.errorRegister = 'Something went wrong';
        }
      })
    } else {
      const passwordControl = this.formRegister.get('passwordRegister');
      if (this.formRegister.get('firstname')?.hasError('required')) {
        this.errorRegister = "Ime je obavezno polje";
      } else if (this.formRegister.get('lastname')?.hasError('required')) {
        this.errorRegister = "Prezime je obavezno polje";
      } else if (this.formRegister.get('usernameRegister')?.hasError('required')) {
        this.errorRegister = "Korisnicko ime je obavezno polje";
      } else if (this.formRegister.get('passwordRegister')?.hasError('required')) {
        this.errorRegister = "Lozinka je obavezno polje";
      } else if (passwordControl?.hasError('passwordRequirements')) {
        this.errorRegister = this.passwordErrors['passwordRequirements'];
      } else if (passwordControl?.hasError('repeatingCharacters')) {
        this.errorRegister = this.passwordErrors['repeatingCharacters'];
      } else if (this.formRegister.get('email')?.hasError('required')) {
        this.errorRegister = "E-mail je obavezno polje";
      } else if (this.formRegister.get('phone')?.hasError('required')) {
        this.errorRegister = "Telefon je obavezno polje";
      } else if (this.formRegister.get('address')?.hasError('required')) {
        this.errorRegister = "Adresa je obavezno polje";
      }
      const emailControl = this.formRegister.get('email');
      if (emailControl?.hasError('pattern')){
        this.errorRegister = "E-mail nije dobrog formata";
      }
    }
  }

  getImageUrl(imageName: string): string {
    return `../../assets/${imageName}`;
  }

  onFileSelected(event: any) {
    console.log(event.target.files[0])
    this.selectedFile = event.target.files[0].name;
  }

}
