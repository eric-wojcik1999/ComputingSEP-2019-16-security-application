import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError, mapTo } from 'rxjs/operators';
import { Router } from '@angular/router';

interface myData{
  success: boolean;
  message: string
}

interface isLoggedIn{
  loggedIn: boolean
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USERNAME = 'Username';
  private jwtToken: string;
  public loggedUser: string;
  baseurl = 'https://127.0.0.1:8000';
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router){}

  getCode(userData): Observable<any> {
    const body = { username: userData.username, password: userData.password };
    return this.http.post<any>(this.baseurl + '/2fa/get-code/', body, {headers: this.httpHeaders});
  }

  login(authToken, authCode, userData): Observable<any> {
    const body = { code_token: authToken, code: authCode };
    return this.http.post<any>(this.baseurl + '/2fa/auth/', body)
      .pipe(
        tap(tokens => this.doLoginUser(tokens, userData)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

  refreshToken() {
      const body = { token: this.jwtToken };
      return this.http.post<any>(this.baseurl + '/2fa/refresh/', body).
      pipe(tap((tokens: any) => {
        this.jwtToken = JSON.stringify(tokens.token);
        this.storeTokens();
      }));
  }


  register(userData) {
    //return this.http.post<any>(this.baseurl + '/auth/register', userData).pipe(map(res => {
    //this.login(userData);
//}));
}

  logout() {
    this.doLogoutUser();
    alert('You have logged out');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLogoutUser(){
    this.loggedUser = null;
    this.removeTokens();
  }

  private doLoginUser(tokens: any, username: string){
    this.loggedUser = username;
    console.log(this.loggedUser);
    console.log(username);
    this.jwtToken = JSON.stringify(tokens.token);
    this.storeTokens();
  }

  private storeTokens(){
    localStorage.setItem(this.JWT_TOKEN, this.jwtToken);
    localStorage.setItem(this.USERNAME, this.loggedUser);
    this.router.navigate(['/']);
  }

  private removeTokens(){
    this.jwtToken = '';
    this.loggedUser = '';
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USERNAME);
  }

}



