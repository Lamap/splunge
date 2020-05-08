import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {map, startWith} from 'rxjs/internal/operators';
import {Observable} from 'rxjs/index';
import {User} from 'firebase';

@Component({
  selector: 'spg-header',
  templateUrl: './header.widget.html',
  styleUrls: ['./header.widget.scss']
})
export class HeaderWidget implements OnInit {
  public email$: Observable<string>;
  public user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
    this.email$ = this.authService.user$.pipe(
      map(user => {
        return user.email;
      }),
      startWith('')
    );
  }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOut();
  }

}
