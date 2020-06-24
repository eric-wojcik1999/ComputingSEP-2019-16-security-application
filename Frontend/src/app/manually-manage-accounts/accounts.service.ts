import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { request } from 'https';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private REST_API_SERVER = "https://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  httpHeaders_delete = new HttpHeaders({'Content-Type': 'application/json',
                                         'Access-Control-Allow-Origin': 'https://127.0.0.1:8000/accounts/'});

  constructor(private httpClient: HttpClient) { }


  // Testing on Adding a User to the database
  public createUser(user): Observable<any> {
      const body = {        
        username: user.username,
        password: user.password,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: user.phone,
        company: user.company,
        companyList: [],
        isAdmin: user.isAdmin
      };
      return this.httpClient.post(this.REST_API_SERVER + '/accounts/', body, {headers: this.httpHeaders})
  }


  public getAccountInfo() {
      return this.httpClient.get(this.REST_API_SERVER + "/accounts/", {headers: this.httpHeaders});
  }

  public getCompanyData() {
      return this.httpClient.get(this.REST_API_SERVER + "/company/", {headers: this.httpHeaders});
  }

  public deleteUser(name){
      return this.httpClient.delete(this.REST_API_SERVER + "/accounts/" + name, {headers: this.httpHeaders_delete});
  }

  public editUser(user, name){

      const body = {        
        username: name,
        password: user.password,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: user.phone,
        company: user.company,
        //companyList: [1],
        isAdmin: user.isAdmin
      };
      
      return this.httpClient.put(this.REST_API_SERVER + '/accounts/' + name + "/", body, {headers: this.httpHeaders})
  }

}
