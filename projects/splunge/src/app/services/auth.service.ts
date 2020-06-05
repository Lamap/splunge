import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FlashMessageService } from './flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User | null>;

  constructor(
    private fbAuth: AngularFireAuth,
    private router: Router,
    private flashMessageService: FlashMessageService
  ) {
    this.user$ = this.fbAuth.user;
    this.fbAuth.authState.subscribe(snapshot => {
      console.log('authState changed', snapshot);
    });
  }

  logIn(email: string, psw: string) {
    this.fbAuth.signInWithEmailAndPassword(email, psw)
      .then(() => {
        console.log('logged in');
        this.router.navigateByUrl('');
        this.flashMessageService.showInfo('You just logged in.');
      })
      .catch(error => {
        console.warn('Login failed', error);
        this.flashMessageService.showError(error.message);
      });
  }

  logOut() {
    this.fbAuth.signOut()
      .then(success => {
        console.log('logged out');
        this.router.navigateByUrl('/login');
      })
      .catch(error => console.warn('Failed to log out:', error));
  }

}
