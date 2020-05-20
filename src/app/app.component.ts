import { Component, OnInit } from '@angular/core';
import { AuthService } from './api/_services/authService/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DRM-UI';
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin-token');
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    if(adminToken){
      this.authService.decodedAdminToken = this.jwtHelper.decodeToken(adminToken);
    }
  }

  //Retrival Registration Page
  documentControl = new FormControl();
  documentOptions: string[] = ['ყუთი', 'პაკეტი', 'დოკუმენტი'];

  serviceControl = new FormControl();
  serviceOptions: string[] = ['სკანირებული', 'დედანთან გათანაბრებული', 'დედანი', 'უკან დაბრუნება'];

  prioritetyControl = new FormControl();
  prioritetyOptions: string[] = ['რეგულარი', 'ექსპრესი', 'ემერჯენსი'];
}
