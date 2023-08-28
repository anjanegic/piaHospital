import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  constructor(private servis: UserService, private ruter: Router,  private formBuilder: FormBuilder) { }
  profileForm: FormGroup;
  loggedInUsername: string = "";
  loggedInUser: User;
  editingProfile: boolean = false;
  showEditProfilePictureInput: boolean = false;

  doctors: User[] = [];
  patients: User[] = [];
  editableFields: { label: string; value: string }[] = [];
  showEditButton: boolean = false;

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

  }

  viewUser(username: string): void {
    // Preusmeravanje na detalje korisnika (prilagodite putanju)
    this.ruter.navigate(['/detalji-korisnika', username]);
  }

  selectedDoctor: User;

  selectDoctor(doctor) {
    this.servis.getLoggedInUser(doctor).subscribe((user: User) => {
      this.selectedDoctor = user;
      // this.servis.getChosenAppointments(doctor).subscribe((app: Appointment[]) => {
      //   this.doctorsAppointments = app;
      // });
    });
  }

  selectedPatient: User;

  selectPatient(patient) {
    this.servis.getLoggedInUser(patient).subscribe((user: User) => {
      this.selectedPatient = user;
      this.editableFields = [
        { label: 'Ime', value: this.selectedPatient.first_name },
        { label: 'Prezime', value: this.selectedPatient.last_name },
        { label: 'Adresa', value: this.selectedPatient.address },
        { label: 'E-mail adresa', value: this.selectedPatient.email },
        { label: 'Kontakt telefon', value: this.selectedPatient.phone },
      ];
      this.profileForm = this.formBuilder.group({
        first_name: [this.selectedPatient.first_name, Validators.required],
        last_name: [this.selectedPatient.last_name, Validators.required],
        address: [this.selectedPatient.address, Validators.required],
        email: [
          this.selectedPatient.email,
          [Validators.required, Validators.email],
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
          } else {
          }
        });
      }
    }
  }

  handleProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Implementirajte logiku za promenu profilne slike
    }
    this.showEditProfilePictureInput = false;
  }

  cancelEditingProfile() {
    this.editingProfile = false;
    this.showEditProfilePictureInput = false;
  }
  startEditingProfile() {
    this.editingProfile = true;
    this.showEditProfilePictureInput = true;
  }
}
