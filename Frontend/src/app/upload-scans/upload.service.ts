import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError ,  Observable,  Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators'; 

const url = "https://127.0.0.1:8000";

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) { }
  
    public uploadfile(scan: File): Observable<any> {
      var formData: any = new FormData();
      formData.append("scan", scan, scan.name);
      alert('Yay it was uploaded');
      return this.http.post(url, formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        catchError(this.errorMgmt)
        
      )
    
    }
  
    errorMgmt(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
    }
  
  }
  