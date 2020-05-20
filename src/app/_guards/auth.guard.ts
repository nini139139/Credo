import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../api/_services/authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
constructor(private authService: AuthService, private router: Router) {}

   canActivate(): boolean {
     if (this.authService.loggedIn() || this.authService.isAdminLoggedIn()) {
       return true;
     }

     this.router.navigate(['home']);
     return false;
     }
}
