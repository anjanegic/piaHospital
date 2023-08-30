import { Appointment } from './../models/appointment';
import { Specialization } from './../models/spetialization';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecializationService } from '../specialization.service';
import { passwordValidator } from '../validators/passwordValidator';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  constructor(private servis: UserService, private specServis: SpecializationService,private ruter: Router,  private formBuilder: FormBuilder) {
    this.formRegister = new FormGroup({
      usernameRegister: new FormControl('', Validators.required),
      passwordRegister: new FormControl('', [Validators.required, passwordValidator()]),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9+_.-]+@(.+)$")]),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      license:  new FormControl('', Validators.required),
      specialization:  new FormControl('', Validators.required),
      profilePicture: new FormControl('')
    });
    this.editForm = this.formBuilder.group({
      name: [''],
      duration: [''],
      price: ['']
    });
  }

  editForm: FormGroup;
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
    this.refreshPatientsWaiting();
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', Validators.required],
    });
    this.getAllSpec();
    this.specializationForm = this.formBuilder.group({
      name: ['', Validators.required],
      branch: ['', Validators.required]
    });
  }

  selectedDoctor: User;

  editableFieldsDoctor: { label: string; value: string }[] = [];
  showEditButtonDoctor: boolean = false;
  editingProfileDoctor: boolean = false;
  profileFormDoctor: FormGroup;
  specializations: Array<Specialization>


  unapprovedAppointments: Object[]
  getUnapprovedAppointments(){
    this.unapprovedAppointments =  this.selectedDoctor.appointments.filter(a=>!a.approved)
  }

  approvedAppointments: Object[]
  getApprovedAppointments(){
    this.approvedAppointments= this.selectedDoctor.appointments.filter(a=>a.approved)
  }

  selectDoctor(doctor) {
    this.servis.getLoggedInUser(doctor).subscribe((user: User) => {
      this.selectedDoctor = user;
      this.getApprovedAppointments();
      this.getUnapprovedAppointments();
      this.getAllSpec();
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

    });
  }

  approve(appointment){
    this.servis.approveAppointment(this.selectedDoctor.username ,appointment.name).subscribe((user:User) => {
      if (user) {
        this.selectedDoctor = user;
        this.getApprovedAppointments();
        this.getUnapprovedAppointments();
      }
    });
  }

  getAllSpec(){
    this.specServis.getAllSpecializations().subscribe((spec: Specialization[])=>{
      this.specializations = spec;
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
    this.servis.deleteUser(user.username).subscribe((respObj) => {
      if (respObj['message'] == 'ok') {
        this.refreshPatients();
        this.refreshDoctors();
        this.clearSelectedPatient();
        this.clearSelectedDoctor();
      }
    })
}

  handleProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
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

  patientsWaiting: User[]=[]

  refreshPatientsWaiting(){
    this.servis.getAllPatientsWaiting().subscribe((patients: User[]) => {
      this.patientsWaiting = patients;
    });
  }

  approvePatient(username){
    this.servis.approveUser(username).subscribe((respObj) => {
      if (respObj['message'] == 'ok') {
        this.refreshPatientsWaiting()
        this.refreshPatients();
      }
    })
  }

  // NEW DOCTOR

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

  submitNewUser(){
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

      let license = this.formRegister.get('license').value;
      let specialization = this.formRegister.get('specialization').value;
      let appointments;
      let branch;

      for (let s of this.specializations){
        if (s.name === specialization){
          this.specialization = s;
          appointments = this.specialization.appointments;
          branch = this.specialization.branch;
        }
      }

      this.servis.checkExistingUser(username, email).subscribe((respObj) => {
        if (respObj['message'] === 'exists') {
          this.errorRegister = 'Korisnik sa istim korisničkim imenom ili emailom već postoji';
        } else if (respObj['message'] === 'ok') {
          this.servis.registerDoctor(username, password, firstname, lastname, email, address, phone, profilePicture, license, specialization, branch, appointments).subscribe((respObj)=>{
            if(respObj['message']=='ok'){
              this.registerSuccess = 'Uspesno';
              this.formRegister.reset();
              this.refreshDoctors();
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
      } else if (this.formRegister.get('license')?.hasError('require')){
        this.errorRegister = "Licenca je obavezno polje";
      }else if (this.formRegister.get('specialization')?.hasError('require')){
        this.errorRegister = "Specijalizacija je obavezno polje";
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

  specializationForm: FormGroup;
  specSuccess: string = ''
  submitSpecialization() {
    this.specSuccess = ''
    if (this.specializationForm.valid) {
      const name = this.specializationForm.get('name').value;
      const branch = this.specializationForm.get('branch').value;

      this.specServis.addSpecialization(name, branch).subscribe((respObj) => {
        if (respObj['message'] == 'ok') {
          this.getAllSpec();
          this.specSuccess = "Uspesno dodata"
        }
      })
      this.specializationForm.reset();
    }
  }

  selectedSpecialization: Specialization;
  selectedAppointmentForEdit: Appointment;


  onSpecializationChange() {
    this.selectedAppointmentForEdit = null;
  }


  deleteAppointment(appointment) {
    console.log(appointment);
    console.log(this.selectedSpecialization);

    this.specServis.deleteAppointment(appointment.name, this.selectedSpecialization.name).subscribe((spec: Specialization) => {
      if (spec) {
        this.selectedSpecialization = spec;
        this.getAllSpec();
      }
    })
    this.servis.disableAppointment(appointment.name, this.selectedSpecialization.name).subscribe((user: User) => {
      if (user) {

      }
    })

  }

  selectAppointmentForEdit(appointment) {
    this.selectedAppointmentForEdit = { ...appointment };
    console.log(this.selectedAppointmentForEdit);
    this.editForm.patchValue({
      name: appointment.name,
      duration: appointment.duration,
      price: appointment.price
    });

  }

  editAppointment(appointment) {
    this.editForm.patchValue({
      name: this.selectedAppointmentForEdit.name,
      duration: this.selectedAppointmentForEdit.duration,
      price: this.selectedAppointmentForEdit.price
    });
  }

  saveEditedAppointment() {
    console.log(this.selectedAppointmentForEdit);

    const editedAppointment = this.editForm.value;
    console.log(editedAppointment);
    this.specServis.changeAppointment(editedAppointment, this.selectedSpecialization, this.selectedAppointmentForEdit).subscribe((respObj) => {
      if (respObj) {
        this.getAllSpec();
        this.editForm.reset();
      }
    })
    this.servis.changeAppointment(editedAppointment, this.selectedSpecialization, this.selectedAppointmentForEdit).subscribe((respObj) => {
      if (respObj['message'] == 'ok') {
        this.getAllSpec();
        this.editForm.reset();
      }
    })
    this.specializationForm.reset();
  }

  newAppointment: Appointment = {
    name: '',
    duration: 0,
    price: 0,
    chosen: false,
    approved: true
  };
  appointmentSuccess: string = "";
  appointmentError: string = "";

  onSubmit() {
    this.appointmentSuccess = "";
    if (this.selectedSpecialization==null){
      this.appointmentError = 'Morate odabrati specijalizaciju';
    }else{
      this.servis.createAppointmentManager(this.selectedSpecialization, this.newAppointment).subscribe((respObj) => {
        console.log(respObj);

        if (respObj['message'] == 'success') {

          //this.refreshCheckedAppointments();
        }
      })
      this.specServis.createAppointment(this.selectedSpecialization, this.newAppointment).subscribe((respObj) => {
        console.log(respObj);
        if (respObj['message'] == 'success') {
          this.appointmentSuccess = 'Pregled je sacuvan';
          //this.refreshCheckedAppointments();
        }
      })
    }


    this.newAppointment = {
      name: '',
      duration: 0,
      price: 0,
      chosen: false,
      approved: true
    };
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
