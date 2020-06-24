import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-upload-scans',
  templateUrl: './upload-scans.component.html',
  styleUrls: ['./upload-scans.component.css']
})
export class UploadScansComponent implements OnInit {


  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  constructor(private httpClient: HttpClient) { }
   
  ngOnInit() {
  }
   
  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      
  }
 
    
  onSubmit() {
    const formData = new FormData();
    formData.append('files', this.fileData, this.fileData.name);
     
    this.fileUploadProgress = '0%';
    this.httpClient.post('https://127.0.0.1:8000/upload/' + this.fileData.name, this.fileData, {
      reportProgress: true,
      observe: 'events'   
    })
    .subscribe(events => {
      // This shows % progress of file being uploaded
      if(events.type === HttpEventType.UploadProgress) {
        this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
        console.log(this.fileUploadProgress);
      } else if(events.type === HttpEventType.Response) {
        this.fileUploadProgress = '';
        console.log(this.fileUploadProgress);
       // console.log(events.body);            
        alert('Your scan ' + this.fileData.name + ' has been uploaded!');/*  + '\n' +  + '\n' + this.fileData);*/
      
      }
         
    }) 
  }
}