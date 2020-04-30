import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'spg-header',
  templateUrl: './header.widget.html',
  styleUrls: ['./header.widget.scss']
})
export class HeaderWidget implements OnInit {

  constructor(private authService: AuthService) {
    /*
    this.authService.user$.subscribe(snapshot => {
      console.log('user snapshot', snapshot);
    });
    */
  }

  ngOnInit(): void {
  }

}
