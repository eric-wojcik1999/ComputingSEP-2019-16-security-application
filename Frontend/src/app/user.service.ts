import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseurl = 'http://127.0.0.1:8000';
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  sendCredentials(userData): Observable<any> {
    return this.http.post(this.baseurl + '/login/', userData,
    {headers: this.httpHeaders});
  }

}
