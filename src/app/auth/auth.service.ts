import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor() { }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authChange.next(this.isAuth());
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authChange.next(this.isAuth());
  }

  logout() {
    this.user = null;
    this.authChange.next(this.isAuth());
  }

  getUser(): User {
    return { ...this.user };
  }

  isAuth(): boolean {
    return this.user != null;
  }
}
