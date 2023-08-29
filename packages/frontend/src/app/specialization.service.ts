import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpecializationService {

  uri = 'http://localhost:4000/specializations';

  constructor(private http: HttpClient) { }

  getAllSpecializations(){
    return this.http.get(`${this.uri}/getAllSpecializations`);
  }
}
