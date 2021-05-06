import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  loadingSubscripion: Subscription;

  constructor(
    private authService: AuthService,
    // private uiService: UiService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      })
    });
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubscripion = this.uiService.loadingStateChanged
    //   .subscribe(result => this.isLoading = result);
  }

  // ngOnDestroy(): void {
  //   if (this.loadingSubscripion) {
  //     this.loadingSubscripion.unsubscribe();
  //   }
  // }

  onSubmit(): void {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }
}
