import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UiService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  isLoading = false;
  loadingSubscripion: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingSubscripion = this.uiService.loadingStateChanged
      .subscribe(result => this.isLoading = result);
  }

  ngOnDestroy(): void {
    this.loadingSubscripion.unsubscribe();
  }

  onSubmit(signupForm: NgForm): void {
    this.authService.registerUser({
      email: signupForm.value.email,
      password: signupForm.value.password,
    });
  }
}
