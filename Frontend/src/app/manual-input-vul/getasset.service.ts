import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAsset {

  private REST_API_SERVER = "https://127.0.0.1:8000";
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  httpHeaders_delete = new HttpHeaders({'Content-Type': 'application/json',
                                         'Access-Control-Allow-Origin': 'https://127.0.0.1:8000/accounts/'});

  constructor(private httpClient: HttpClient) { }

  // to populate asset array in manual input vul 
  public getAssetData() {
    return this.httpClient.get(this.REST_API_SERVER + "/assets/" , {headers: this.httpHeaders});
  }

}
