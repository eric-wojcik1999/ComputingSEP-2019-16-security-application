import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetAPIService {
  //baseurl = 'http://127.0.0.1:8000';
  baseurl = 'https://localhost:8000';
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  createAsset(asset): Observable<any> {
    const body = {name: asset.name, desc: asset.desc, type: asset.type, company: asset.company, 
      version_num: asset.version, features: asset.features, host_address: asset.host_address, mac_address: asset.mac_address, 
      hist_data: asset.hist_data, owner: asset.owner, business_crit: asset.business_crit,
       asset_dept: asset.asset_dept, est_worth: asset.est_worth, platform: asset.platform, domain: asset.domain};

    return this.http.post(this.baseurl + '/assets/', body,
       {headers: this.httpHeaders});
  }

  sendAsset(asset): Observable<any> {
    

    const body = {name: asset.name, desc: asset.desc, type: asset.type, asset_company: asset.asset_company, 
    version_num: asset.version_num, features: asset.features, host_address: asset.host_addr, mac_address: asset.mac, 
    hist_data: asset.hist_data, owner: asset.owner, business_crit: asset.business_crit,
     asset_dept: asset.asset_dept, est_worth: asset.est_worth, platform: asset.platform, domain: asset.domain};




return this.http.post(this.baseurl + '/assets/', body,
   {headers: this.httpHeaders});
}

  getAllAssets(): Observable<any>{
    return this.http.get(this.baseurl + '/assets/',
    {headers: this.httpHeaders});
  }

}
