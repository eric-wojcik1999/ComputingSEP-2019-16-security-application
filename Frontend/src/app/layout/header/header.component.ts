import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public username: any;

  constructor(private api: AuthService, private router: Router) {
    console.log('Header constructor running');
  }

  ngOnInit() {
    this.username = localStorage.getItem('Username');
  }

  logoutUser = () => {
    this.api.logout();
  }

}
