import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private snackbar: MatSnackBar) { }

  showSnackbarError(message: string, action: string, duration: number): void {
    this.showSnackbar(message, action, duration, ['red-snackbar']);
  }

  showSnackbar(message: string, action: string, duration: number, panelClass: string[]): void {
    this.snackbar.open(message, action, {
      duration,
      panelClass
    });
  }
}
