import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VulApiService {

  baseurl = 'https://127.0.0.1:8000';
  //baseurl = 'https://localhost:8000';
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  // test with updated names 
  createVul(vul): Observable<any> {
    const body = { 
      name: vul.name, 
      description: vul.desc, 
      severity: vul.severity, 
      dateDiscovered: vul.date_discovered, 
      dateModified: vul.date_modified, 
      dateResolved: vul.date_resolved, 
      actionPlan: vul.action_plan, 
      solution: vul.solution, 
      assetID: vul.asset, 
      status: vul.status,
      scanType: vul.scan_type,
      reference: vul.reference,
      cvssScore: vul.cvs_score
       };

    return this.http.post('https://127.0.0.1:8000/vulnerability/', body, {headers: this.httpHeaders} 
    );
  }
  // Original create vul post request 
  /*createVul(vul): Observable<any> {
    const body = { name: vul.name, status: vul.status, plan: vul.plan, desc: vul.desc, scan: vul.scan, solution: vul.sol, severity: vul.sev, reference: vul.ref, cvs: vul.cvs, date_disc: vul.date_disc, date_mod: vul.date_mod, date_res: vul.date_res, asset: vul.asset};

    return this.http.post(this.baseurl + '/vulnerability/', body, {headers: this.httpHeaders} 
    );
  }*/
  
  getAllVuls(): Observable<any>{
    return this.http.get(this.baseurl + '/vulnerability/',
    {headers: this.httpHeaders});
  }

  // Use to check server response 
  getServerResponse(pParams){
    return this.http.get(this.baseurl, {params: pParams, observe: 'response'})
  }

  
}
