import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService],
})
export class AppComponent {   
}