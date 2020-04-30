import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User | null>;

  constructor(private fbAuth: AngularFireAuth) {
    this.user$ = this.fbAuth.user;
    // auth.signInWithEmailAndPassword('sddfsdfds', 'sfasad');
    /// this.fbAuth.user;
    this.fbAuth.authState.subscribe(snapshot => {
      console.log('authState', snapshot);
    });
  }

  logIn(email: string, psw: string) {
    const cucc = new auth.EmailAuthProvider();
    this.fbAuth.signInWithEmailAndPassword(email, psw);
    // auth.signInWithEmailAndPassword(email, psw);
    /*
    this.fbAuth.(email, psw);
    this.afAuth.auth.signInWithEmailAndPassword(email, psw)
      .then(success => console.log('Logged in'))
      .catch(error => console.warn('Failed to authenticate:', error));
      */
  }

  logOut() {
    /*
    this.afAuth.auth.signOut()
      .then(success => {
        console.log('logged out');
      })
      .catch(error => console.warn('Failed to log out:', error));
      */
  }

}
