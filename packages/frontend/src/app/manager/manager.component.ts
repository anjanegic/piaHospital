import { Appointment } from './../models/appointment';
import { Specialization } from './../models/spetialization';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecializationService } from '../specialization.service';
import { passwordValidator } from '../validators/passwordValidator';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  constructor(private servis: UserService, private specServis: SpecializationService,private ruter: Router,  private formBuilder: FormBuilder) { }

  passwordErrors: {[key: string]: string} = {
    passwordRequirements: "Lozinka mora da ima između 8 i 14 karaktera, da ima 1 veliko slovo, 1 broj, 1 specijalni znak i da počinje slovom",
    repeatingCharacters: "Lozinka ne sme da sadrži znakove koji se ponavljaju"
  };
  passwordForm: FormGroup;
  error: string = "";
  passwordChanged: string = "";

  loggedInUsername: string = "";
  loggedInUser: User;

  showEditProfilePictureInput: boolean = false;

  doctors: User[] = [];
  patients: User[] = [];


  refreshPatients(){
    this.servis.getAllPatients().subscribe((patients: User[]) => {
      this.patients = patients;
    });
  }

  refreshDoctors(){
    this.servis.getAllDoctors().subscribe((doctors: User[]) => {
      this.doctors = doctors;
    });

  }

  ngOnInit(): void {
    this.refreshDoctors();
    this.refreshPatients();
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', Validators.required],
    });
  }

  selectedDoctor: User;

  editableFieldsDoctor: { label: string; value: string }[] = [];
  showEditButtonDoctor: boolean = false;
  editingProfileDoctor: boolean = false;
  profileFormDoctor: FormGroup;
  specializations: Array<Specialization>

  selectDoctor(doctor) {
    this.servis.getLoggedInUser(doctor).subscribe((user: User) => {
      this.selectedDoctor = user;

      this.specServis.getAllSpecializations().subscribe((spec: Specialization[])=>{
        this.specializations = spec;
        this.editableFieldsDoctor = [
          { label: 'Ime', value: this.selectedDoctor.first_name },
          { label: 'Prezime', value: this.selectedDoctor.last_name },
          { label: 'Adresa', value: this.selectedDoctor.address },
          { label: 'E-mail adresa', value: this.selectedDoctor.email },
          { label: 'Korisnicko ime', value: this.selectedDoctor.username },
          { label: 'Kontakt telefon', value: this.selectedDoctor.phone },
          { label: 'Specijalizacija', value: this.selectedDoctor.specialization },
          { label: 'Ogranak', value: this.selectedDoctor.branch },
        ];
        this.profileFormDoctor = this.formBuilder.group({
          first_name: [this.selectedDoctor.first_name, Validators.required],
          last_name: [this.selectedDoctor.last_name, Validators.required],
          address: [this.selectedDoctor.address, Validators.required],
          email: [
            this.selectedDoctor.email,
            [Validators.required, Validators.email],
          ],
          phone: [this.selectedDoctor.phone, Validators.required],
          username: [this.selectedDoctor.username, Validators.required],
          specialization: [this.selectedDoctor.specialization, Validators.required],
          branch: [this.selectedDoctor.branch, Validators.required],
        });
      })
    });
  }

  selectedPatient: User;

  editableFields: { label: string; value: string }[] = [];
  showEditButton: boolean = false;
  editingProfile: boolean = false;
  profileForm: FormGroup;

  selectPatient(patient) {
    this.servis.getLoggedInUser(patient).subscribe((user: User) => {
      this.selectedPatient = user;
      this.editableFields = [
        { label: 'Ime', value: this.selectedPatient.first_name },
        { label: 'Prezime', value: this.selectedPatient.last_name },
        { label: 'Adresa', value: this.selectedPatient.address },
        { label: 'E-mail adresa', value: this.selectedPatient.email },
        { label: 'Korisnicko ime', value: this.selectedPatient.username },
        { label: 'Kontakt telefon', value: this.selectedPatient.phone },
      ];
      this.profileForm = this.formBuilder.group({
        first_name: [this.selectedPatient.first_name, Validators.required],
        last_name: [this.selectedPatient.last_name, Validators.required],
        address: [this.selectedPatient.address, Validators.required],
        email: [
          this.selectedPatient.email,
          [Validators.required, Validators.email]
        ],
        username: [
          this.selectedPatient.username,
          [Validators.required]
        ],
        phone: [this.selectedPatient.phone, Validators.required],
      });
    });
  }

  clearSelectedDoctor(): void {
    this.selectedDoctor = null;
  }

  clearSelectedPatient(): void {
    this.selectedPatient = null;
  }

  saveEditedProfile() {
    if (this.profileForm.valid) {
      const updatedProfile = {};
      for (const field in this.profileForm.controls) {
        if (this.profileForm.controls[field].dirty) {
          updatedProfile[field] = this.profileForm.controls[field].value;
        }

      }
      if (Object.keys(updatedProfile).length > 0) {
        this.servis.updateUserProfile(this.selectedPatient.username, updatedProfile).subscribe((respObj) => {
          if (respObj['message'] == 'ok') {
            for (const key in updatedProfile) {
              if (updatedProfile.hasOwnProperty(key)) {
                this.selectedPatient[key] = updatedProfile[key];
              }
            }
            this.refreshPatients()
            this.editingProfile = false;
            this.showEditProfilePictureInput = false;
          }
        });
      }
    }
  }

  specialization: Specialization;
  saveEditedProfileDoctor(){

    if (this.profileFormDoctor.valid) {
      const updatedProfile = {};
      for (const field in this.profileFormDoctor.controls) {
        if (this.profileFormDoctor.controls[field].dirty) {
          updatedProfile[field] = this.profileFormDoctor.controls[field].value;
          if (field === 'specialization'){
            for (let s of this.specializations){
              if (s.name === updatedProfile[field]){
                this.specialization = s;
                updatedProfile["appointments"] = this.specialization.appointments;
                updatedProfile["branch"] = this.specialization.branch;
              }
            }
          }
        }
        console.log(updatedProfile);

      }
      if (Object.keys(updatedProfile).length > 0) {
        this.servis.updateUserProfile(this.selectedDoctor.username, updatedProfile).subscribe((respObj) => {
          if (respObj['message'] == 'ok') {
            for (const key in updatedProfile) {
              if (updatedProfile.hasOwnProperty(key)) {
                this.selectedDoctor[key] = updatedProfile[key];
              }
            }
            this.refreshDoctors()
            this.editingProfileDoctor = false;
            this.showEditProfilePictureInput = false;
          }
        });
      }
    }
  }

  deleteUser(user){
    this.servis.deleteUser(this.selectedPatient.username).subscribe((respObj) => {
      if (respObj['message'] == 'ok') {
        this.refreshPatients();
        this.clearSelectedPatient();
      }
    })
}

  handleProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // promena profilne slike
    }
    this.showEditProfilePictureInput = false;
  }

  cancelEditingProfile() {
    this.editingProfile = false;
    this.showEditProfilePictureInput = false;
  }

  cancelEditingProfileDoctor() {
    this.editingProfileDoctor = false;
    this.showEditProfilePictureInput = false;
  }

  startEditingProfile() {
    this.editingProfile = true;
    this.showEditProfilePictureInput = true;
  }

  startEditingProfileDoctor(){
    this.editingProfileDoctor = true;
    this.showEditProfilePictureInput = true;
  }

  changeThePassword() {
    this.error = '';
    this.passwordChanged = ''
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('oldPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
      const confirmPassword = this.passwordForm.get('confirmPassword').value;
      if (newPassword === confirmPassword) {
        this.servis.changePassword(this.loggedInUsername, oldPassword, newPassword).subscribe((respObj) => {
          if (respObj['message'] == 'ok') {
            this.passwordChanged = 'Lozinka je promenjena';
          }
          else {
            this.error = 'Pogresna stara lozinka';
          }
        })
      } else {
        this.error = "Lozinke se ne podudaraju"
      }
    } else {
      const passwordControl = this.passwordForm.get('newPassword');
      if (passwordControl?.hasError('passwordRequirements')) {
        this.error = this.passwordErrors['passwordRequirements'];
      } else if (passwordControl?.hasError('repeatingCharacters')) {
        this.error = this.passwordErrors['repeatingCharacters'];
      }
    }
  }

  logout() {
    sessionStorage.clear()
    this.ruter.navigate(['manager-login'])
  }
}
