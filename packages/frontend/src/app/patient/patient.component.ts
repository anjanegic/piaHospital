import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { passwordValidator } from '../validators/passwordValidator';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  profileForm: FormGroup;
  passwordForm: FormGroup;
  error: string = "";
  passwordChanged: string = "";
  loggedInUsername: string = "";
  loggedInFirstname: string = "";
  loggedInLastname: string = "";
  loggedInUser: User;
  editableFields: { label: string; value: string }[] = [];
  editingProfile: boolean = false;
  showEditProfilePictureInput: boolean = false;
  passwordErrors: {[key: string]: string} = {
    passwordRequirements: "Password must be between 8 and 14 characters, have 1 uppercase character, 1 number, 1 special character and start with a letter!",
    repeatingCharacters: "Password must not contain repeating characters."
  };
  minDate: string;
  maxDate: string;

  searchText: string = '';
  doctors: User[] = [];
  filteredDoctors: User[] = [];
  doctorsToDisplay: User[] = [];
  sortAscending: boolean = true;
  constructor(private servis: UserService ,private router: Router, private formBuilder: FormBuilder ) {
    const today = new Date();
    const nextTwoWeeks = new Date();
    nextTwoWeeks.setDate(today.getDate() + 14);

    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = nextTwoWeeks.toISOString().split('T')[0];

  }

  ngOnInit() {
    console.log("Ulogovan: ", sessionStorage.getItem('username'))
    this.loggedInUsername = sessionStorage.getItem('username')
    this.loggedInFirstname = sessionStorage.getItem('first_name')
    this.loggedInLastname = sessionStorage.getItem('last_name')
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', Validators.required]
    });

    this.servis.getLoggedInUser(this.loggedInUsername).subscribe((user: User) => {
      this.loggedInUser = user;
      this.editableFields = [
        { label: 'Ime', value: this.loggedInUser.first_name },
        { label: 'Prezime', value: this.loggedInUser.last_name },
        { label: 'Adresa', value: this.loggedInUser.address },
        { label: 'E-mail adresa', value: this.loggedInUser.email },
        { label: 'Kontakt telefon', value: this.loggedInUser.phone }
        ];
        this.profileForm = this.formBuilder.group({
          first_name: [this.loggedInUser.first_name, Validators.required],
          last_name: [this.loggedInUser.last_name, Validators.required],
          address: [this.loggedInUser.address, Validators.required],
          email: [this.loggedInUser.email, [Validators.required, Validators.email]],
          phone: [this.loggedInUser.phone, Validators.required]
        });
    });
    this.servis.getAllDoctors().subscribe((doctors: User[]) => {
      this.doctors = doctors;
      this.updateDisplayedDoctors();
    });
  }
  changeThePassword() {
    this.error='';
    this.passwordChanged=''
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('oldPassword').value;
      const newPassword = this.passwordForm.get('newPassword').value;
      const confirmPassword = this.passwordForm.get('confirmPassword').value;
      if (newPassword === confirmPassword) {
        this.servis.changePassword(this.loggedInUsername, oldPassword, newPassword).subscribe((respObj)=>{
          if(respObj['message']=='ok'){
            this.passwordChanged = 'Lozinka je promenjena';
          }
          else {
            this.error = 'Pogresna stara lozinka';
          }
        })
      } else {
        this.error = "Lozinke se ne podudaraju"
      }
    } else{
      const passwordControl = this.passwordForm.get('newPassword');
        if (passwordControl?.hasError('passwordRequirements')) {
        this.error = this.passwordErrors['passwordRequirements'];
      } else if (passwordControl?.hasError('repeatingCharacters')) {
        this.error = this.passwordErrors['repeatingCharacters'];
      }
    }
  }

  startEditingProfile() {
    this.editingProfile = true;
    this.showEditProfilePictureInput = true;
  }

  saveEditedProfile() {
    if (this.profileForm.valid) {
      const updatedProfile = {};
      console.log(updatedProfile)
      console.log(this.profileForm.controls)
      for (const field in this.profileForm.controls) {

        if (this.profileForm.controls[field].dirty) {
          updatedProfile[field] = this.profileForm.controls[field].value;
        }
      }
      console.log(Object.keys(updatedProfile));
      console.log(this.profileForm.controls)
      if (Object.keys(updatedProfile).length > 0) {
        this.servis.updateUserProfile(this.loggedInUsername, updatedProfile).subscribe((respObj)=>{
          if (respObj['message'] == 'ok') {
            for (const key in updatedProfile) {
              if (updatedProfile.hasOwnProperty(key)) {
                this.loggedInUser[key] = updatedProfile[key];
              }
            }
              this.editingProfile = false;
              this.showEditProfilePictureInput = false;
          } else {
          }
        });
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
        doctor.specialization.toLowerCase().includes(lowerCaseSearch) ||
        doctor.branch.toLowerCase().includes(lowerCaseSearch)
      );
    });
    this.doctorsToDisplay = this.filteredDoctors; // Ažurirajte doctorsToDisplay
  }

  cancelEditingProfile() {
    this.editingProfile = false;
    this.showEditProfilePictureInput = false;
    // Resetujte vrednosti editableFields na originalne vrednosti iz loggedInUser
  }
  showEditButton: boolean = false;

  editProfilePicture() {
    // Implementirajte logiku za izmenu profilne slike
  }
  handleProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Implementirajte logiku za promenu profilne slike
    }
    this.showEditProfilePictureInput = false;
  }

  selectedDoctor: User;

  selectDoctor(doctor){
    this.servis.getLoggedInUser(doctor).subscribe((user: User) => {
      this.selectedDoctor = user;
    });
  }

  clearSelectedDoctor(): void {
    this.selectedDoctor = null;
  }

  selectedAppointmentType: string = '';
  selectedDate: string;
  selectedHour: number;
  hours: number[] = Array.from({ length: 9 }, (_, i) => i + 9); // Sati od 9 do 17
  errorBook: string;

  scheduleAppointment() {
    this.errorBook="";
    let selectedDateTime = null;
    if (this.selectedDate && this.selectedHour !== undefined) {
      const [year, month, day] = this.selectedDate.split('-');
      selectedDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), this.selectedHour, 0, 0);

      console.log(selectedDateTime);
      this.servis.findAppointment(this.selectedDoctor, selectedDateTime).subscribe((respObj)=>{
        if(respObj['message']=='error'){
          this.errorBook="Termin nije slobodan, molimo vas izaberite drugi"
        }else {
          this.servis.bookAppointment(this.selectedDoctor, this.loggedInUsername, selectedDateTime, this.selectedAppointmentType).subscribe((respObj)=>{
            if(respObj['message']=='ok'){
              this.errorBook="Vas termin je zakazan"
            }
          })
        }
      })
    }
  }

  logout(){
    sessionStorage.clear()
    this.router.navigate([''])
  }

}
