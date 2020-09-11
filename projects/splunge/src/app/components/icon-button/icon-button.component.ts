import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spg-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {
  @Input() iconId: string;
  @Input() title: string;
  @Input() type = '';
  public adjustClassNames: string[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.iconId === 'unlink') {
      this.iconId = 'link';
      this.adjustClassNames.push('unlink');
    }

    if (this.type) {
      this.adjustClassNames.push(this.type);
    }
  }

}
