import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Action } from 'rxjs/internal/scheduler/Action';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { GetAsset } from '../manual-input-vul/getasset.service';


export interface Vulnerability{
  vulnID: number,
  vulnName: string,
  vulnDescription: string,
  vulnSeverity: number,
  vulnDateDiscovered: string,
  vulnDateModified: string,
  vulnDateResolved: string,
  vulnActionPlan: string,
  vulnSolution: string,
  vulnAssetID: number,
  vulnStatus: string,
  vulnScanType: string,
  vulnReference: string,
  vulnCvssScore: number
}

var VULNERABILITY_DATA: Vulnerability[] = [
];

// interface to display assets in form
export interface Asset{
  id: number;
  name: string;
}

@Component({
  selector: 'app-display-vulnerabilities',
  templateUrl: './display-vulnerabilities.component.html',
  styleUrls: ['./display-vulnerabilities.component.css']
})
export class DisplayVulnerabilitiesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: false}) paginator:MatPaginator;
  @ViewChild(MatSort, {static: true}) sort:MatSort;
  displayedColumns = ["vulnID", "vulnName", "vulnStatus", "vulnDescription", "actions", "edit"];
  dataSource = new MatTableDataSource(VULNERABILITY_DATA);  
  numberOfEntries;
  currentIndexToEdit;
  vulnerabilityToEdit: Vulnerability;

  status_options = [
    { id: 1, value: 'A', name: 'Accepted'},
    { id: 2, value: 'U', name: 'Unhandled'},
    { id: 3, value: 'M', name: 'Mitigated'},
    { id: 4, value: 'N', name: 'Unassigned'},
    { id: 5, value: 'F', name: 'False Positive'}
  ];
  
  scan_options = [
    { id: 1, value: 'M', name: 'Manual'},
    { id: 2, value: 'Nes', name: 'Nessus'},
    { id: 3, value: 'Nex', name: 'Nexpose'},
    { id: 4, value: 'Nm', name: 'NMAP'},
    { id: 5, value: 'Z', name: 'Zap'}
  ];
  
  // In case a max level for severity is ever set a drop down can be used 
  severity_options = [
    { id: 1, ngValue: '1'},
    { id: 2, ngValue: '2'},
    { id: 3, ngValue: '3'},
    { id: 4, ngValue: '4'},
    { id: 5, ngValue: '5'},
    { id: 6, ngValue: '6'},
    { id: 7, ngValue: '7'},
    { id: 8, ngValue: '8'},
    { id: 9, ngValue: '9'},
    { id: 10, ngValue: '10'},
  ];
  
  // options for assets
assets: Asset[] = [
  
];

  vul_details = this.formBuilder.group({
    vul_name: ['', Validators.required],
    vul_desc: [''],
    vul_status: ['', Validators.required], // use dropdown 
    vul_asset: ['', Validators.required],  // implement search for this 
    vul_sol: [''],
    vul_sev: ['', [Validators.required, Validators.pattern('[0-9]+')]], //cannot be blank and must be a digit
    vul_scan:['', Validators.required], // use dropdown 
    vul_ref: [''],
    vul_cvs: ['',Validators.pattern((/^(\d{0,2}\.\d{0,1})$|^10$|^\d{0,2}$/))],
    vul_datedisc: ['', Validators.required],
    vul_datemod: [''],
    vul_dateres: [''],
    vul_plan: [''],
  
  });


  constructor(
    public dialog: MatDialog,
    public http: HttpClient,
    private formBuilder: FormBuilder,
    private getAsset: GetAsset
  ) { }

  ngOnInit() {
    //this.numberOfEntries = 0;
    this.numberOfEntries = 2; //Purely for testing purposes
    // Get all of the Asset Data
    this.getAsset.getAssetData().subscribe((data: Asset[])=>{
      var length = Object.keys(data).length;
      this.assets = new Array<Asset>(length);
      for(var i=0; i<length; i++)
      {
          this.assets[i] = {id: data[i].id, name: data[i].name};
      }
  });
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateDataSource(numEntries){
    this.dataSource = new MatTableDataSource(VULNERABILITY_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.numberOfEntries =  numEntries;
  }

  startForm(index){
    document.getElementById("shownAndUnshown").style.display = "flex";
    //let index = VULNERABILITY_DATA.indexOf(vuln);
    this.vulnerabilityToEdit = VULNERABILITY_DATA[index];
    this.vul_details.reset({
      vul_name: [this.vulnerabilityToEdit.vulnName],
      vul_desc: [this.vulnerabilityToEdit.vulnDescription],
      vul_status: [this.vulnerabilityToEdit.vulnStatus], // use dropdown 
      vul_asset: [this.vulnerabilityToEdit.vulnAssetID],  // implement search for this 
      vul_sol: [this.vulnerabilityToEdit.vulnSolution],
      vul_sev: [this.vulnerabilityToEdit.vulnSeverity], //cannot be blank and must be a digit
      vul_scan:[this.vulnerabilityToEdit.vulnScanType], // use dropdown 
      vul_ref: [this.vulnerabilityToEdit.vulnReference],
      vul_cvs: [this.vulnerabilityToEdit.vulnCvssScore],
      vul_datedisc: [this.vulnerabilityToEdit.vulnDateDiscovered],
      vul_datemod: [this.vulnerabilityToEdit.vulnDateModified],
      vul_dateres: [this.vulnerabilityToEdit.vulnDateResolved],
      vul_plan: [this.vulnerabilityToEdit.vulnActionPlan],
    })

    this.vul_details = this.formBuilder.group({
      vul_name: [this.vulnerabilityToEdit.vulnName],
      vul_desc: [this.vulnerabilityToEdit.vulnDescription],
      vul_status: [this.vulnerabilityToEdit.vulnStatus], // use dropdown 
      vul_asset: [this.vulnerabilityToEdit.vulnAssetID],  // implement search for this 
      vul_sol: [this.vulnerabilityToEdit.vulnSolution],
      vul_sev: [this.vulnerabilityToEdit.vulnSeverity], //cannot be blank and must be a digit
      vul_scan:[this.vulnerabilityToEdit.vulnScanType], // use dropdown 
      vul_ref: [this.vulnerabilityToEdit.vulnReference],
      vul_cvs: [this.vulnerabilityToEdit.vulnCvssScore],
      vul_datedisc: [this.vulnerabilityToEdit.vulnDateDiscovered],
      vul_datemod: [this.vulnerabilityToEdit.vulnDateModified],
      vul_dateres: [this.vulnerabilityToEdit.vulnDateResolved],
      vul_plan: [this.vulnerabilityToEdit.vulnActionPlan],
    });

    this.currentIndexToEdit = index;
    this.clearDataSource();
  }

  async editVulnerability(){
    let testData: Vulnerability [] = [];
    let val = await this.http.get("https://127.0.0.1:8000/vulnerability/?format=json").toPromise();
    let numberOfVulns = Object.keys(val).length;
    for(let i = 0; i < numberOfVulns; i++){
      testData.push({vulnID: val[i].vulnID, 
        vulnName: val[i].name, 
        vulnDescription: val[i].description, 
        vulnSeverity: val[i].severity, 
        vulnDateDiscovered: val[i].dateDiscovered, 
        vulnDateModified: val[i].dateModified, 
        vulnDateResolved: val[i].dateResolved, 
        vulnActionPlan: val[i].actionPlan, 
        vulnSolution: val[i].solution, 
        vulnAssetID: val[i].assetID, 
        vulnStatus: val[i].status, 
        vulnScanType: val[i].scanType, 
        vulnReference: val[i].reference, 
        vulnCvssScore: val[i].cvssScore});
    }

    const body ={
      name: this.vul_details.controls['vul_name'].value, 
      description: this.vul_details.controls['vul_desc'].value, 
      severity: this.vul_details.controls['vul_sev'].value, 
      dateDiscovered: this.vul_details.controls['vul_datedisc'].value, 
      dateModified: this.vul_details.controls['vul_datemod'].value, 
      dateResolved: this.vul_details.controls['vul_dateres'].value, 
      actionPlan: this.vul_details.controls['vul_plan'].value, 
      solution: this.vul_details.controls['vul_sol'].value, 
      assetID: this.vul_details.controls['vul_asset'].value, 
      status: this.vul_details.controls['vul_status'].value,
      scanType: this.vul_details.controls['vul_scan'].value,
      reference: this.vul_details.controls['vul_ref'].value,
      cvssScore: this.vul_details.controls['vul_cvs'].value
    }


    await this.http.put("https://127.0.0.1:8000/vulnerability/"+testData[this.currentIndexToEdit].vulnID+"/", body).toPromise();
    window.alert("Successfully Edited");
    
    let getAll = await this.http.get("https://127.0.0.1:8000/vulnerability/?format=json").toPromise();
    let countGetAll = Object.keys(getAll).length;

    for(let i = 0; i < countGetAll; i++){
      VULNERABILITY_DATA.push({vulnID: getAll[i].vulnID, 
        vulnName: getAll[i].name, vulnDescription: 
        getAll[i].description, 
        vulnSeverity: getAll[i].severity, 
        vulnDateDiscovered: getAll[i].dateDiscovered, 
        vulnDateModified: getAll[i].dateModified, 
        vulnDateResolved: getAll[i].dateResolved, 
        vulnActionPlan: getAll[i].actionPlan, 
        vulnSolution: getAll[i].solution, 
        vulnAssetID: getAll[i].assetID, 
        vulnStatus: getAll[i].status, 
        vulnScanType: getAll[i].scanType, 
        vulnReference: getAll[i].reference, 
        vulnCvssScore: getAll[i].cvssScore});
    }
    this.updateDataSource(countGetAll);
    document.getElementById("shownAndUnshown").style.display="none";
  }



  clearDataSource(){
    for(var i = 0; i < this.numberOfEntries; i++){
      VULNERABILITY_DATA.pop();
    }  
    this.updateDataSource(0);
  }

  async queryDatabase(event){
    document.getElementById("shownAndUnshown").style.display="none";
    event.preventDefault();
    const target = event.target;
    var count = 0;

    this.clearDataSource();

    var vulnerabilityID = target.querySelector('#vulnerabilityID').value;
    var vulnerabilityName = target.querySelector('#vulnerabilityName').value;
    var vulnerabilityStatus = target.querySelector('#vulnerabilityStatus').value;
    var vulnerabilitySeverity = target.querySelector('#vulnerabilitySeverity').value;
    var vulnerabilityDescription = target.querySelector('#vulnerabilityDescription').value;
    var vulnerabilityAssetEffected = target.querySelector('#vulnerabilityAssetEffected').value;

    var queriedData;
    var fieldsToQuery = [];
    var valueForQuery =[];

    var queryString="?";

    if(vulnerabilityID != ""){
      queryString+="vulnID="+vulnerabilityID+"&";
    }
    if(vulnerabilityName != ""){
      queryString+="name="+vulnerabilityName+"&";
    }
    if(vulnerabilityStatus != ""){
      queryString+="status="+vulnerabilityStatus+"&";
    }
    if(vulnerabilitySeverity != ""){
      queryString+="severity="+vulnerabilitySeverity+"&";
    }
    if(vulnerabilityDescription != ""){
      queryString+="description="+vulnerabilityDescription+"&";
    }
    if(vulnerabilityAssetEffected != ""){
      queryString+="assetID="+vulnerabilityAssetEffected+"&";
    }

    
    if(vulnerabilityID != ""){
      fieldsToQuery[count] = "vulnID";
      valueForQuery[count] = vulnerabilityID;
      count++;
    } else{
      fieldsToQuery[count] = 1;
      valueForQuery[count] = 1;
      count++;
    }

    if(vulnerabilityName != ""){
      fieldsToQuery[count] = "vulnName";
      valueForQuery[count] = vulnerabilityName;
      count++;
    } else{
      fieldsToQuery[count] = 1;
      valueForQuery[count] = 1;
      count++;
    }

    if(vulnerabilityStatus != ""){
      fieldsToQuery[count] = "vulnStatus";
      valueForQuery[count] = vulnerabilityStatus;
      count++;
    } else{
      fieldsToQuery[count] = 1;
      valueForQuery[count] = 1;
      count++;
    }

    if(vulnerabilitySeverity != ""){
      fieldsToQuery[count] = "vulnSeverity";
      valueForQuery[count] = vulnerabilitySeverity;
      count++;
    } else{
      fieldsToQuery[count] = 1;
      valueForQuery[count] = 1;
      count++;
    }

    if(vulnerabilityDescription != ""){
      fieldsToQuery[count] = "vulnDescription";
      valueForQuery[count] = vulnerabilityDescription;
      count++;
    } else{
      fieldsToQuery[count] = 1;
      valueForQuery[count] = 1;
      count++;
    }

    if(vulnerabilityAssetEffected != ""){
      fieldsToQuery[count] = "vulnAssetAssetEffected";
      valueForQuery[count] = vulnerabilityAssetEffected;
      count++;
    } else{
      fieldsToQuery[count] = 1;
      valueForQuery[count] = 1;
      count++;
    }

    let val = await this.http.get("https://127.0.0.1:8000/vulnerability/?format=json").toPromise();
      var newEntry = [];
      var TEMP_DATA: Vulnerability [] = [];
      var count = Object.keys(val).length;
      for(var i = 0; i < count; i++){
        TEMP_DATA.push({vulnID: val[i].vulnID, 
          vulnName: val[i].name, 
          vulnDescription: val[i].description, 
          vulnSeverity: val[i].severity, 
          vulnDateDiscovered: val[i].dateDiscovered, 
          vulnDateModified: val[i].dateModified, 
          vulnDateResolved: val[i].dateResolved, 
          vulnActionPlan: val[i].actionPlan, 
          vulnSolution: val[i].solution, 
          vulnAssetID: val[i].assetID, 
          vulnStatus: val[i].status, 
          vulnScanType: val[i].scanType, 
          vulnReference: val[i].reference, 
          vulnCvssScore: val[i].cvssScore});
      }

      
      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQuery[0] == 1){
          return true;
        } else{
          return(v[fieldsToQuery[0]] == valueForQuery[0]);
        }
      })

      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQuery[1] == 1){
          return true;
        } else{
          return(v[fieldsToQuery[1]].toString().toLowerCase().includes(valueForQuery[1].toLowerCase()));
        }
      })


      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQuery[2] == 1){
          return true;
        } else{
          return(v[fieldsToQuery[2]].toString().toLowerCase().includes(valueForQuery[2].toLowerCase()));
        }
      })



      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQuery[3] == 1){
          return true;
        } else{
          return(v[fieldsToQuery[3]].toString().toLowerCase().includes(valueForQuery[3].toLowerCase()));
        }
      })


      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQuery[4] == 1){
          return true;
        } else{
          return(v[fieldsToQuery[4]].toString().toLowerCase().includes(valueForQuery[4].toLowerCase()));
        }
      })      


      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQuery[5] == 1){
          return true;
        } else{
          return(v[fieldsToQuery[5]].toString().toLowerCase().includes(valueForQuery[5].toLowerCase()));
        }
      })


      VULNERABILITY_DATA = TEMP_DATA;
      this.updateDataSource(Object.keys(TEMP_DATA).length);

    /* 

    if(vulnID is not null){
      arrayWhereVulnID = vulnID
      if(vulnName is not null){
        if(status is not null){

        }else{

        }
      }else{

      }
    }
    
    /* Generate a query based on the above fields */

  }

  openDialog(i){
    const dialogConfig = this.dialog.open(PreviewVulnerability, {
      width: '500px',
      height: '500px',
      /* This next line accounts for data across multiple pages, as the row index changes back to 1 when you go to another page. */
      data: VULNERABILITY_DATA[i] 
    });

    //this.dialog.open(PreviewVulnerability, dialogConfig);
    
    dialogConfig.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });

  }

}




@Component({
  selector: 'preview-vulnerability-dialog',
  templateUrl: './preview-vulnerability-dialog.html'
})
export class PreviewVulnerability{
  constructor(
    public dialogConfig: MatDialogRef<PreviewVulnerability>,
    @Inject(MAT_DIALOG_DATA) public data: Vulnerability,
    public dialog: MatDialog){}

  actionPlanDialog(){
    console.log(this.data.vulnActionPlan);
    const apDialogConfig = this.dialog.open(ActionPlanDialog, {
      width: '500px',
      height: '500px',
      data: this.data.vulnActionPlan
    });

    apDialogConfig.afterClosed().subscribe(result =>{
      console.log('Dialog close');
    })
  }

  clickCancel(): void{
    this.dialogConfig.close();
  }    
}

@Component({
  selector: 'action-plan-dialog',
  templateUrl: './action-plan-dialog.html',
  styleUrls: ['./action-plan-dialog.css']
})
export class ActionPlanDialog{
  constructor(
    public dialogConfig: MatDialogRef<ActionPlanDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog
  ){}

  clickCancel(): void{
    this.dialogConfig.close();
  }

}
