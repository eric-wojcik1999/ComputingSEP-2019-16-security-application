import { Injectable } from '@angular/core';

// something Observable. Check this out 
import { Observable, of } from 'rxjs';

// Importing Asset to get all the fields. Doesn't seem to be working - come back to this 
import { Asset } from './asset-fields';

// To get messages / notification when successfully getting Assets from database
import { ManualInputMessageService } from './manual-input-message.service';

// for HTTP
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class ManualInputService {

  // CHECK THIS IS RIGHT - should be base/collectionName - address of the asset resource on server 
  private assetURL = 'api/assetDB';


  constructor(
    private manualInputMessageService: ManualInputMessageService,
    private http: HttpClient) { }
  
  // to get Asset from database
  getAsset(): Observable<Asset> {
    return this.http.get<Asset>(this.assetURL)
  }

  /*getAsset(): Observable<Asset> {
    this.manualInputMessageService.add('Fetched Asset');
    return of(Asset);
  }*/

  // Private method - to log message with ManualInputMessageService
  private log(message: string) {
    this.manualInputMessageService.add('ManualInputService: ${message}');
  }
}

