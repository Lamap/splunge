import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'spg-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss']
})
export class FileSelectorComponent implements OnInit {
  @ViewChild('fileupload', { static: false }) fileInput;
  @Output() fileSelected$ = new EventEmitter<File>();
  @Input() acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  @Input() maxSize = 350 * 1024;

  private selectedFile: File;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

  browseFiles() {
    this.fileInput.nativeElement.click();
  }

  fileAdded($event) {
    this.selectedFile = $event.target.files.item(0);
    if (this.isValid(this.selectedFile)) {
      this.fileSelected$.emit(this.selectedFile);
    }
  }

  isValid(file: File) {
    const problems = [];
    if (file.size > this.maxSize) {
      problems.push('file-selector.problems.tooBigSize');
    }
    if (this.acceptedTypes.indexOf(file.type) === -1) {
      problems.push('file-selector.problems.invalidFileType');
    }
    if (problems.length) {
      console.warn(problems.join(', '));
    }
    return !problems.length;
  }
}
