import { Component, OnInit, ViewChild, AfterViewInit, Host } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup, EmailValidator, FormControl } from '@angular/forms';
import { AccountsService } from '../manually-manage-accounts/accounts.service';

export interface Asset {
  ID: number;
  Name: string;
  Desc: string;
  Type: string;
  Comp: string;
  Version: string;
  Feat: string;
  Host: string;
  Hist: string;
  Owner: string;
  Crit: string;
  Dept: string;
  Worth: number;
  Platform: string;
  Mac: string;
  Domain: string;
}

export interface Company{
  id: number;
  name: string;
}

var Asset_Data: Asset[] = [
  // { ID: 1, Name: "set_Test", Desc: "Info about an set", Type:"Endpoint", Comp: "Test company", Version: "12.53.12", Feat: "Yes", Host: "192.168.0.1", Hist: "No", Owner: "Admin", Crit: "VH", Dept: "Fake Dept", Worth: 9001, Platform: "Windows", Mac: "E4:B2:31:45"}, 
  // { ID: 2, Name: "set_Test2", Desc: "Info about an set", Type:"Endpoint", Comp: "Test company", Version: "12.53.122", Feat: "Yes", Host: "192.168.0.254", Hist: "No", Owner: "Steve", Crit: "L", Dept: "Fake Dept", Worth: 9001, Platform: "Windows", Mac: "E4:B2:31:45"},
  // { ID: 3, Name: "Test3", Desc: "Info about an set", Type:"Endpoint", Comp: "Test company", Version: "12.53.122", Feat: "Yes", Host: "192.168.0.254", Hist: "No", Owner: "Steve", Crit: "L", Dept: "Fake Dept", Worth: 9001, Platform: "Windows", Mac: "E4:B2:31:45"}
];


@Component({
  selector: 'app-display-assets',
  templateUrl: './display-assets.component.html',
  styleUrls: ['./display-assets.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])]
})


export class DisplayAssetsComponent implements OnInit {
  expandAsset: Asset | null;
  // dataSource = new MatTableDataSource(Asset_Test);
  dataSource = new MatTableDataSource(Asset_Data);
  displayedColumns = ['Name','Type', 'Owner', 'Host', 'Platform'];
  asCols = ['ID', 'Name', 'Desc', 'Type', 'Comp', 'Version', 'Feat', 'Host', 'Hist', 'Owner', 'Crit', 'Dept', 'Worth', 'Platform', 'Domain'];
  currentIndexForEdit;
  
  
  assetToEdit: Asset;

  type_options = [
    { id: 1, value: 'E', name: 'Endpoint'},
    { id: 2, value: 'Prod', name: 'Product'}
  ];
 
  crit_options = [
   { id: 1, value: '0', name: 'None'},
   { id: 2, value: 'VL', name: 'Very Low'},
   { id: 3, value: 'L', name: 'Low'},
   { id: 4, value: 'M', name: 'Medium'},
   { id: 5, value: 'H', name: 'High'},
   { id: 1, value: 'VH', name: 'Very High'}
 ];

 companies: Company[] = [
   
 ];

 asset_details = this.formBuilder.group({
  asset_name: [''],
  asset_type: [''], // changed to drop down
  asset_version: [''],
  asset_owner: [''],
  asset_history:[''],
  asset_desc: ['', Validators.required],
  asset_host_addr: [''],
  asset_mac: [''],
  asset_platform: [''],
  asset_features: [''],
  asset_business_crit: [''],
  asset_est_worth: ['', Validators.pattern( /^(\d{0,5}\.\d{1,2}|\d{1,5})$/)], // must be a digit 
  asset_dept: [''],
  asset_company: ['', Validators.required],
  asset_domain: ['']
      
});


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(public http: HttpClient, private formBuilder: FormBuilder, private accountsApiService: AccountsService) {
    
  }


	applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit() {
    this.fillAssets();
    this.dataSource = new MatTableDataSource(Asset_Data);
    this.accountsApiService.getCompanyData().subscribe((data: Company[])=>{
      var length = Object.keys(data).length;
      // Declare company so we can store the name and ID dynamically upon loading of the page
      this.companies = new Array<Company>(length);
      for(var i=0; i<length; i++)
      {
          this.companies[i] = {id: data[i].id, name: data[i].name};
      }
  });
  }



  onSubmit(asset){
    document.getElementById("shownAndUnshown").style.display="flex";
    let index = Asset_Data.indexOf(asset);
    this.assetToEdit = Asset_Data[index];
    this.asset_details.reset({
      asset_name: [this.assetToEdit.Name],
      asset_type: [this.assetToEdit.Type], // changed to drop down
      asset_version: [this.assetToEdit.Version],
      asset_owner: [this.assetToEdit.Owner],
      asset_history:[this.assetToEdit.Hist],
      asset_desc: [this.assetToEdit.Desc],
      asset_host_addr: [this.assetToEdit.Host],
      asset_mac: [this.assetToEdit.Mac],
      asset_platform: [this.assetToEdit.Platform],
      asset_features: [this.assetToEdit.Feat],
      asset_business_crit: [this.assetToEdit.Crit],
      asset_est_worth: [this.assetToEdit.Worth], // must be a digit 
      asset_dept: [this.assetToEdit.Dept],
      asset_company: [this.assetToEdit.Comp],
      asset_domain: [this.assetToEdit.Comp]
    });

    this.asset_details = this.formBuilder.group({
      asset_name: [this.assetToEdit.Name],
      asset_type: [this.assetToEdit.Type], // changed to drop down
      asset_version: [this.assetToEdit.Version],
      asset_owner: [this.assetToEdit.Owner],
      asset_history:[this.assetToEdit.Hist],
      asset_desc: [this.assetToEdit.Desc],
      asset_host_addr: [this.assetToEdit.Host],
      asset_mac: [this.assetToEdit.Mac],
      asset_platform: [this.assetToEdit.Platform],
      asset_features: [this.assetToEdit.Feat],
      asset_business_crit: [this.assetToEdit.Crit],
      asset_est_worth: [this.assetToEdit.Worth], // must be a digit 
      asset_dept: [this.assetToEdit.Dept],
      asset_company: [this.assetToEdit.Comp],
      asset_domain: [this.assetToEdit.Domain]
    })
    this.currentIndexForEdit = index;

    
    
    this.clearDataSource();

  }

  async editAsset(){
    let testData: Asset[] = [];
    let resultFromGet = await this.http.get("https://127.0.0.1:8000/assets/?format=json").toPromise();
    var num_asset = Object.keys(resultFromGet).length;
    for(var i = 0; i < num_asset; i++)
      {
        testData.push({ID: resultFromGet[i].id,
                         Name: resultFromGet[i].name,
                         Desc: resultFromGet[i].desc, 
                         Type: resultFromGet[i].type,
                         Comp: resultFromGet[i].company,
                         Version: resultFromGet[i].version_num,
                         Feat: resultFromGet[i].features,
                         Host: resultFromGet[i].host_address,
                         Mac: resultFromGet[i].mac_address,
                         Hist: resultFromGet[i].hist_data,
                         Owner: resultFromGet[i].owner,
                         Crit: resultFromGet[i].business_crit,
                         Dept: resultFromGet[i].asset_dept,
                         Worth: resultFromGet[i].est_worth,
                         Platform: resultFromGet[i].platform,
                         Domain: resultFromGet[i].domain
                        });
      }
    
    let newAsset: Asset;

    const body = { 
      name: this.asset_details.controls['asset_name'].value, 
      desc: this.asset_details.controls['asset_desc'].value, 
      type: this.asset_details.controls['asset_type'].value, 
      company: this.asset_details.controls['asset_company'].value,
      version_num: this.asset_details.controls['asset_version'].value, 
      features: this.asset_details.controls['asset_features'].value, 
      host_address: this.asset_details.controls['asset_host_addr'].value, 
      mac_address: this.asset_details.controls['asset_mac'].value, 
      hist_data: this.asset_details.controls['asset_history'].value, 
      owner: this.asset_details.controls['asset_owner'].value, 
      business_crit: this.asset_details.controls['asset_business_crit'].value,
      asset_dept: this.asset_details.controls['asset_dept'].value, 
      est_worth: this.asset_details.controls['asset_est_worth'].value, 
      platform: this.asset_details.controls['asset_platform'].value, 
      domain: this.asset_details.controls['asset_domain'].value
       };
    

    let result = await this.http.put("https://127.0.0.1:8000/assets/"+testData[this.currentIndexForEdit].ID+"/", body).toPromise();

    window.alert("Successfully Edited");
    this.clearDataSource();
    this.fillAssets();
    document.getElementById("shownAndUnshown").style.display="none";

    
  }

    
  clearDataSource(){
    var length = Asset_Data.length;
    for(var i = 0; i < length; i++){
      Asset_Data.pop();
    }
    this.dataSource = new MatTableDataSource(Asset_Data);
  }

  //asset: Asset;
  
  async fillAssets() {
    this.clearDataSource();
  
    var the_url = 'https://127.0.0.1:8000/';
    var retAsset: Asset[];

    let theAsset = await this.http.get('https://127.0.0.1:8000/assets/?format=json').toPromise()
      var num_asset = Object.keys(theAsset).length;
      for(var i = 0; i < num_asset; i++)
      {
        Asset_Data.push({ID: theAsset[i].id,
                         Name: theAsset[i].name,
                         Desc: theAsset[i].desc, 
                         Type: theAsset[i].type,
                         Comp: theAsset[i].company,
                         Version: theAsset[i].version_num,
                         Feat: theAsset[i].features,
                         Host: theAsset[i].host_address,
                         Mac: theAsset[i].mac_address,
                         Hist: theAsset[i].hist_data,
                         Owner: theAsset[i].owner,
                         Crit: theAsset[i].business_crit,
                         Dept: theAsset[i].asset_dept,
                         Worth: theAsset[i].est_worth,
                         Platform: theAsset[i].platform,
                         Domain: theAsset[i].domain
                        });
      }
      retAsset = Asset_Data;
      this.dataSource = new MatTableDataSource(Asset_Data);
      console.log(retAsset);
    return retAsset;
  }
  
  clearTable() {
    for(var i = 0; i < Object.keys(Asset_Data).length; i++){
      Asset_Data.pop();
      console.log(i);
    }
    
  }
  
}