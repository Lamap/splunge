import { Component, OnInit } from '@angular/core';
import { ImageData } from '../../../services/image-crud.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'spg-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.less']
})
export class ImageControlComponent implements OnInit {

  public isAdminMode = false;
  public image: ImageData;

  constructor(private authService: AuthService) {
      authService.user$.subscribe(user => {
          if (user) {
              this.isAdminMode = true;
          } else {
              this.isAdminMode = false;
          }
      });
  }

  ngOnInit() {
  }
}
