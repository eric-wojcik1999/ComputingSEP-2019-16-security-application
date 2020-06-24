import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DashboardApiService {

  private REST_API_SERVER = "https://127.0.0.1:8000";

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});


  constructor(private httpClient:HttpClient) { }

  public getCompanyData() {
      return this.httpClient.get(this.REST_API_SERVER + "/company/", {headers: this.httpHeaders});
  }

  public getVulnerabilityData() {
      return this.httpClient.get(this.REST_API_SERVER + "/vulnerability/", {headers: this.httpHeaders});
  }

  public getAssetData() {
      return this.httpClient.get(this.REST_API_SERVER + "/assets/", {headers: this.httpHeaders});
  }
}
