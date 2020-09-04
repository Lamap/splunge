import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'spg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'splunge';
  constructor(
    public translate: TranslateService
  ) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
  }
}
