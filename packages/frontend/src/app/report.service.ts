import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  uri = 'http://localhost:4000/reports';

  constructor(private http: HttpClient) { }

  getUserReports(username){
    const data = {
      username: username
    }
    return this.http.post(`${this.uri}/getUserReports`, data);
  }

  addReport(report){
    console.log(report);

    const data = {
      report: report
    }
    return this.http.post(`${this.uri}/addReport`, data);
  }
}
