import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'spg-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less']
})
export class FileUploaderComponent implements OnInit {

  @ViewChild('fileupload') fileInput;
  @Output() uploadFiles$ = new EventEmitter<any>();

  private tempFile: any;
  private files: Set<File>;

  constructor() { }

  ngOnInit() {
  }

  browseFiles() {
    this.fileInput.nativeElement.click();
  }

  fileAdded($event) {
      const file = $event.target.files.item(0);
      this.tempFile = file;
      console.log('sejhajdihó', file);
      if (file.type.match('image.*')) {
          console.log('we have the file');
          // this.selectedFiles = $event.target.files;
      } else {
          alert('invalid format!');
      }
      //this.imageService.create();
  }

  uploadFiles() {
    console.log('now we upload them all');
    this.uploadFiles$.emit(this.tempFile);
  }

}
