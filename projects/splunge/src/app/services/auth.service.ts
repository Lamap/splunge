import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User | null>;

  constructor(private fbAuth: AngularFireAuth, private router: Router) {
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
      })
      .catch(error => {
        console.warn('Login failed', error);
      });
  }

  logOut() {
    this.fbAuth.signOut()
      .then(success => {
        console.log('logged out');
      })
      .catch(error => console.warn('Failed to log out:', error));
  }

}
