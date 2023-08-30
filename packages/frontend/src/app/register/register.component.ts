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
    passwordRequirements: "Lozinka mora da ima između 8 i 14 karaktera, da ima 1 veliko slovo, 1 broj, 1 specijalni znak i da počinje slovom",
    repeatingCharacters: "Lozinka ne sme da sadrži znakove koji se ponavljaju"
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
      let profilePicture = (this.imagePath) ? this.imagePath : "../../assets/profile-icon-person-user-19.png";
      let username = this.formRegister.get('usernameRegister').value;
      let password = this.formRegister.get('passwordRegister').value;
      let firstname = this.formRegister.get('firstname').value;
      let lastname = this.formRegister.get('lastname').value;
      let email = this.formRegister.get('email').value;
      let address = this.formRegister.get('address').value;
      let phone = this.formRegister.get('phone').value;

      this.servis.checkExistingUser(username, email).subscribe((respObj) => {
        if (respObj['message'] === 'exists') {
          this.errorRegister = 'Korisnik sa istim korisničkim imenom ili emailom već postoji';
        } else if (respObj['message'] === 'ok') {
          this.servis.register(username, password, firstname, lastname, email, address, phone, profilePicture).subscribe((respObj)=>{
            if(respObj['message']=='ok'){
              this.registerSuccess = 'Uspesno';
              this.formRegister.reset();
            }
            else{
              this.errorRegister = 'Doslo je do greške';
            }
          })
        } else {
          this.errorRegister = 'Došlo je do greške';
        }
      });


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

  imagePath: string = ""
  getImageUrl(imageName){
    this.imagePath = `../../assets/${imageName}`;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]['name'];
    this.getImageUrl(this.selectedFile);
  }

  back(){
    this.ruter.navigate([''])
  }

}
