import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {

  public user: any;
  public auth: any;

  constructor(private api: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: '',
    };

    this.auth = {
      token: '',
      code: ''
    };
  }

  getCode = () => {
    this.api.getCode(this.user).subscribe(
      data => {
        this.auth.token = data.token;
        alert('Code has been successfully sent to your email!');
      },
      error => {
        alert('Invalid');
        console.log(error);
      }
    );
  }

  loginUser = () => {
    this.api.login(this.auth.token, this.auth.code, this.user.username).subscribe(
      data => {
        alert('You have successfully logged in as a user!');
        this.router.navigate(['/dashboard']);
      },
      error => {
        alert('Invalid credentials');
        console.log(error);
      }
    );

  }

  logoutUser = () => {
    this.api.logout();
  }
}
