import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar
  ) {}

  initAuthListener(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.trainingService.initSubscriptions();
        this.isAuthenticated = true;
        this.authChange.next(this.isAuthenticated);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(this.isAuthenticated);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {})
      .catch((error) =>
        this.snackbar.open(error.message, null, {
          duration: 5000,
          panelClass: ['red-snackbar'],
        })
      );
  }

  login(authData: AuthData): void {
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {})
      .catch((error) =>
        this.snackbar.open(error.message, null, {
          duration: 5000,
          panelClass: ['red-snackbar'],
        })
      );
  }

  logout(): void {
    this.afAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
