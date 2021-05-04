import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService) { }

  registerUser(authData: AuthData): void {
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.authSuccessfully();
      })
      .catch(error => console.log(error));
  }

  login(authData: AuthData): void {
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.authSuccessfully();
      })
      .catch((error) => console.log(error));
  }

  logout(): void {
    this.trainingService.cancelSubscriptions();
    this.afAuth.signOut();
    this.isAuthenticated = false;
    this.authChange.next(this.isAuthenticated);
    this.router.navigate(['/login']);
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

  private authSuccessfully(): void {
    this.isAuthenticated = true;
    this.authChange.next(this.isAuthenticated);
    this.router.navigate(['/training']);
  }
}
