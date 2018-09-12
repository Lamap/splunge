import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'spg-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less']
})
export class FileUploaderComponent implements OnInit {

  @ViewChild('fileupload') fileInput;
  @Output() uploadFiles$ = new EventEmitter<File>();

  public tempLoadedFile;
  private selectedFile: File;

  constructor() {}

  ngOnInit() {
  }

  browseFiles() {
    this.fileInput.nativeElement.click();
  }

  fileAdded($event) {
      this.selectedFile = $event.target.files.item(0);
      const hasError: string | boolean = this.isInvalid(this.selectedFile);
      if (!hasError) {
          const reader = new FileReader();
          reader.readAsDataURL(this.selectedFile);
          reader.onload = (event) => {
             this.tempLoadedFile = (<any>event.target).result;
          };
      } else {
          alert(hasError);
      }
  }

  uploadFiles() {
    this.uploadFiles$.emit(this.selectedFile);
  }

  isInvalid(file: File) {
    if (!file.type.match('image\/.*jpg|image\/.*jpeg|image\/.*png|image\/.*gif')) {
        return 'The supported image formats are: jpg, jpeg, png and gif';
    }
    if (file.size > 300000) {
        return 'The maximum image size is 300 kb';
    }
    return false;
  }

}
