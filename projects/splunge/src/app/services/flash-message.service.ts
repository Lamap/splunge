import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlashMessageComponent } from '../components/flash-message/flash-message.component';

const defaultOptions = {
  duration: 5000,
  verticalPosition: 'top',
  panelClass: ['spg-snackbar']
};

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  constructor(private flashMessage: MatSnackBar) { }
  showError(message: string) {
    this.show({
      data: {message}
    });
  }

  showInfo(message: string) {
    this.show({
      data: { message }
    });
  }

  show(options) {
    this.flashMessage.openFromComponent(FlashMessageComponent, {...defaultOptions, ...options});
  }
}
