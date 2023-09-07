import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from '../models/appointment';
import { BookedAppointment } from '../models/bookedAppointments';
import { Report } from '../models/report';
import { User } from '../models/user';
import { ReportService } from '../report.service';
import { UserService } from '../user.service';
import { passwordValidator } from '../validators/passwordValidator';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  constructor(private servis: UserService, private reportsService: ReportService, private router: Router, private formBuilder: FormBuilder) {
    const today = new Date();
    const nextTwoWeeks = new Date();
    nextTwoWeeks.setDate(today.getDate() + 14);

    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = nextTwoWeeks.toISOString().split('T')[0];

  }

  ngOnInit(): void {
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
        { label: 'Kontakt telefon', value: this.loggedInUser.phone },
        { label: 'Specijalizacija', value: this.loggedInUser.specialization },
        { label: 'Ogranak', value: this.loggedInUser.branch }
      ];
      this.profileForm = this.formBuilder.group({
        first_name: [this.loggedInUser.first_name, Validators.required],
        last_name: [this.loggedInUser.last_name, Validators.required],
        address: [this.loggedInUser.address, Validators.required],
        email: [this.loggedInUser.email, [Validators.required, Validators.email]],
        phone: [this.loggedInUser.phone, Validators.required],
        specialization: [this.loggedInUser.specialization, Validators.required],
        branch: [this.loggedInUser.branch, Validators.required]
      });
      this.refreshCheckedAppointments();

    });
    this.refreshUpcomingAppointments();

  }

  appointmentsToCheck: any[] = [];
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
  passwordErrors: { [key: string]: string } = {
    passwordRequirements: "Password must be between 8 and 14 characters, have 1 uppercase character, 1 number, 1 special character and start with a letter!",
    repeatingCharacters: "Password must not contain repeating characters."
  };
  minDate: string;
  maxDate: string;


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
            this.logout();
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

  startEditingProfile() {
    this.editingProfile = true;
    this.showEditProfilePictureInput = true;
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
        this.servis.updateUserProfile(this.loggedInUsername, updatedProfile).subscribe((respObj) => {
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

  cancelEditingProfile() {
    this.editingProfile = false;
    this.showEditProfilePictureInput = false;
  }
  showEditButton: boolean = false;

  editProfilePicture() {
  }
  
  handleProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
    }
    this.showEditProfilePictureInput = false;
  }

  saveChosenExaminations() {
    this.servis.saveCheckedAppointments(this.loggedInUsername, this.appointmentsToCheck).subscribe((respObj) => {
      if (respObj['message'] == 'ok') {

      }
    });
  }

  changeSelection() {
    this.fetchSelectedItems()
  }
  checkboxesDataList: Appointment[] = []
  fetchSelectedItems() {
    this.checkboxesDataList = this.appointmentsToCheck.filter((value, index) => {
      return value.isChecked
    });
  }

  upcomingAppointments: BookedAppointment[] = [];

  refreshUpcomingAppointments() {
    this.servis
      .getBookedAppointments(this.loggedInUsername)
      .subscribe((appoin: BookedAppointment[]) => {
        if (appoin['message'].length > 0) {
          this.upcomingAppointments = appoin['message']
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
        } else {
          this.upcomingAppointments = [];
        }

      });
  }

  selectedAppointment: BookedAppointment;
  userReports: Report[];
  openPatientRecord(appointment: BookedAppointment): void {
    this.selectedAppointment = appointment;
    this.getPastBookedAppointments(this.loggedInUser, this.selectedAppointment.patient.username);
    this.getUsersReport();

  }

  getUsersReport(){
    this.reportsService
      .getUserReports(this.selectedAppointment.patient.username)
      .subscribe((reports: Report[]) => {
        this.userReports = reports;
      });
  }
  noSelectedAppointments() {
    this.selectedAppointment = null;
  }

  newAppointment: Appointment = {
    name: '',
    duration: 0,
    price: 0,
    chosen: false,
    approved: false
  };

  appointmentSuccess: string = "";

  onSubmit() {
    this.appointmentSuccess = "";
    this.servis.createAppointment(this.loggedInUser, this.newAppointment).subscribe((respObj) => {

      if (respObj['message'] == 'success') {
        this.appointmentSuccess = 'Vas pregled je sacuvan';
        this.refreshCheckedAppointments();
      }
    })

    this.newAppointment = {
      name: '',
      duration: 0,
      price: 0,
      chosen: false,
      approved: false
    };
  }

  refreshCheckedAppointments() {
    this.appointmentsToCheck=[];
    for (let a of this.loggedInUser.appointments) {
      if (a.approved)
        this.appointmentsToCheck.push(a);
    }
  }

  selectedReport: Report = {
    date: new Date(),
    reasonForVisit: "",
    diagnosis :"",
    recommendedTherapy: "",
    recommendedNextAppointment: null,
    patient: null ,
    doctor: null,
    bookedAppointment: null
  };

  pastBookedAppointments: BookedAppointment[] = [];
  getPastBookedAppointments(doctor, patient) {
    this.servis
      .getPastBookedAppointments(this.loggedInUsername, this.selectedAppointment.patient.username)
      .subscribe((bookedAppointments: BookedAppointment[]) => {
        this.pastBookedAppointments = bookedAppointments;
      });

  }

  reportSuccess : string = '';
  submitReport() {
    this.selectedReport.doctor = this.loggedInUser;
    this.selectedReport.patient = this.pastBookedAppointments[0].patient;

    if (this.selectedReport.recommendedNextAppointment !== undefined)
      this.selectedReport.recommendedNextAppointment = new Date(this.selectedReport.recommendedNextAppointment);

    this.reportsService.addReport(this.selectedReport).subscribe((respObj) => {

      if (respObj['message'] == 'success') {
        this.reportSuccess = 'Izvestaj je sacuvan';
        this.refreshReports();
      }
    })

      this.selectedReport = {
        date: new Date(),
        reasonForVisit: "",
        diagnosis :"",
        recommendedTherapy: "",
        recommendedNextAppointment: null,
        patient: null ,
        doctor: null,
        bookedAppointment: null
      }
  }

  refreshReports(){
    this.getPastBookedAppointments(this.loggedInUsername, this.selectedAppointment.patient.username);
    this.getUsersReport();
  }

  logout() {
    sessionStorage.clear()
    this.router.navigate([''])
  }

}
