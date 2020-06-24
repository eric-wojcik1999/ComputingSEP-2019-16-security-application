import { Component, OnInit, Inject, APP_ID, Directive } from '@angular/core';
// for Form 
import { FormBuilder, FormGroup, EmailValidator, FormControl } from '@angular/forms';
// for validation
import { Validators } from '@angular/forms';

// for dialog box 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

// for exporting to database
import { ManualInputService } from '../manual-input.service';

// for Asset 
import { Asset } from '../asset-fields';
import { AssetAPIService } from './asset-api.service';
import { AccountsService } from '../manually-manage-accounts/accounts.service';

export interface AssetDetailsPreview {
  asset_name: string;
  asset_type: string;
  asset_version: string;
  asset_owner: string;
  asset_history: string;
  asset_desc: string;
  asset_host_addr: string;
  asset_mac: string;
  asset_platform: string;
  asset_features: string;
  asset_business_crit: string;
  asset_est_worth: string;
  asset_dept: string;
  asset_company: string;
  asset_domain: string;
}

export interface Company{
  id: number;
  name: string;
}

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.component.html',
  styleUrls: ['./manual-input.component.css'],
  providers: [AssetAPIService],    
})

export class ManualInputComponent implements OnInit {
  assetObject = {id: -1, name: '', desc: '', type: 'E', company: '-1', version_num: '', features: '',
host_address: '', mac_address: '', hist_data: '', owner: '', business_crit: 'L', asset_dept: '', est_worth: 0.00,
 platform: '', domain: ''};
    
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

// options for company 
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
    asset_est_worth: ['', Validators.pattern('[0-9]+')], // must be a digit 
    asset_dept: [''],
    asset_company: ['', Validators.required],
    asset_domain: ['']
        
  });
  


  name: string;


  createAsset = () => {
    this.api.createAsset(this.assetObject).subscribe(
      data => {
        this.getAssets();
        alert('You have added a new asset: ' + this.asset_details.get('asset_name').value);
      },
      error => {
        alert('Could not add asset - there is an error with: ');
        if(this.asset_details.get('asset_features').value == ""){
          alert('features');
        }
        if(this.asset_details.get('asset_type').value == ""){
          alert('type');
        }
        if(this.asset_details.get('asset_company').value == ""){
          alert('company');
        }
        if(this.asset_details.get('asset_host_addr').value ==""){
          alert('host addr');
        }
        if(this.asset_details.get('asset_mac').value ==""){
          alert('mac');
        }
        if(this.asset_details.get('asset_owner').value==""){
          alert('owner');
        }
        if(this.asset_details.get('asset_business_crit').value ==""){
          alert('business crit');
        }

        if(this.asset_details.get('asset_history').value==""){
          alert('history');
        }

        if(this.asset_details.get('asset_dept').value == ""){
          alert('department');
        }

        if(this.asset_details.get('asset_est_worth').value==""){
          alert('worth');
        }

        if (this.asset_details.get('asset_platform').value==""){
          alert('platform');
        }
        if(this.asset_details.get('asset_version').value==""){
          alert('version');
        }
        if (this.asset_details.get('asset_domain').value==""){
          alert('domain');
        }
    

        console.log(error);
      }
    );
  }

  getAssets = () => {
    this.api.getAllAssets().subscribe(
      data => {
        //console.log(data);
        // would store data in the assetObject above in actual scenario 
      },
      error => {
        console.error(error);
      }
    );
  }
  
  constructor(private formBuilder: FormBuilder, 
    private accountsApiService: AccountsService,
    /* Inject MatDialog to create Dialog instance */public dialog: MatDialog, 
    /*for the database */ 
    private manualInputService: ManualInputService,
              private api: AssetAPIService) { 
                this.getAssets();

  }
    
  asset: Asset;

  openDialog(): void {
    //const dialogConfig = new MatDialogConfig();
    const dialogConfig = this.dialog.open(PreviewAsset, {
      width: '500px', 
      height: '500px', 
      data: { asset_name: this.asset_details.get('asset_name').value,
              asset_type: this.asset_details.get('asset_type').value,
              asset_version: this.asset_details.get('asset_version').value,
              asset_owner: this.asset_details.get('asset_owner').value,
              asset_history: this.asset_details.get('asset_history').value,
              asset_desc: this.asset_details.get('asset_desc').value,
              asset_host_addr: this.asset_details.get('asset_host_addr').value,
              asset_mac: this.asset_details.get('asset_mac').value,
              asset_platform: this.asset_details.get('asset_platform').value,
              asset_features: this.asset_details.get('asset_features').value,
              asset_business_crit: this.asset_details.get('asset_business_crit').value,
              asset_est_worth: this.asset_details.get('asset_est_worth').value,
              asset_dept: this.asset_details.get('asset_dept').value,
              asset_company: this.asset_details.get('asset_company').value,
              asset_domain: this.asset_details.get('asset_domain').value,
            }
    });
   
    dialogConfig.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.name = result;
    });

   
  }

  ngOnInit() {
      // Get all of the Company Data
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

  onSubmit() {
    
    console.warn(this.asset_details.value);
    console.log(this.asset_details.value);
    
    if(this.asset_details.get('asset_name').value == ""){
      this.assetObject.name = null;
    }
    else{
      this.assetObject.name = this.asset_details.get('asset_name').value;
    }
    
    // Description cannot be left empty 
    this.assetObject.desc = this.asset_details.get('asset_desc').value;
    
    if(this.asset_details.get('asset_features').value == ""){
      this.assetObject.features = null;
    }
    else{
      this.assetObject.features = this.asset_details.get('asset_features').value;
    }
    
    // Type cannot be blank 
    this.assetObject.type = this.asset_details.get('asset_type').value; // This can be either E for Endpoint or Prod for Product
    //Company cannot be blank
    this.assetObject.company = this.asset_details.get('asset_company').value;

    if(this.asset_details.get('asset_host_addr').value == ""){
      this.assetObject.host_address = null;
    }
    else {
      this.assetObject.host_address = this.asset_details.get('asset_host_addr').value;
    }
    
    if(this.asset_details.get('asset_mac').value == ""){
      this.assetObject.mac_address = null;
    }
    else{
      this.assetObject.mac_address = this.asset_details.get('asset_mac').value;
    }
   
    if (this.asset_details.get('asset_owner').value == ""){
      this.assetObject.owner = null;
    }
    else {
      this.assetObject.owner = this.asset_details.get('asset_owner').value;
    }
    
    if (this.asset_details.get('asset_business_crit').value == ""){
      this.assetObject.business_crit = null;
    }
    else{
      this.assetObject.business_crit = this.asset_details.get('asset_business_crit').value; // Must not be left blank
    }

    if(this.asset_details.get('asset_history').value == ""){
      this.assetObject.hist_data  = null;
    }
    else{
      this.assetObject.hist_data = this.asset_details.get('asset_history').value;
    }
    
    if (this.asset_details.get('asset_dept').value == "")
    {
      this.assetObject.asset_dept = null;
    }
    else {
      this.assetObject.asset_dept = this.asset_details.get('asset_dept').value;
    }

    if(this.asset_details.get('asset_est_worth').value == ""){
      this.assetObject.est_worth = null; 
    }
    else{
      this.assetObject.est_worth = this.asset_details.get('asset_est_worth').value; // Must not be left blank
    }
   
    if(this.asset_details.get('asset_platform').value == ""){
      this.assetObject.platform = null;
    }
    else{
      this.assetObject.platform = this.asset_details.get('asset_platform').value;
    }

    if(this.asset_details.get('asset_version').value ==  ""){
      this.assetObject.version_num = null;
    }
    else{
      this.assetObject.version_num = this.asset_details.get('asset_version').value;
    }

    if(this.asset_details.get('asset_domain').value ==""){
      this.assetObject.domain = null;
    }
    else {
      this.assetObject.domain = this.asset_details.get('asset_domain').value;
    }
    console.log(this.assetObject);
    this.createAsset();

  }

  // To get assets - eventually from the database
  getAsset(): Asset {
    this.manualInputService.getAsset().subscribe(asset => this.asset = asset);
    return;
  }

}

// Pop up component
@Component({
   selector: 'preview-asset-dialog',
   templateUrl: 'preview-asset-dialog.html',
 })

  export class PreviewAsset {

 
   constructor(
     public dialogConfig: MatDialogRef<PreviewAsset>, 
     @Inject(MAT_DIALOG_DATA) public data: AssetDetailsPreview) { }

     clickCancel(): void {
       this.dialogConfig.close();
     }

     // This is what I will use to send POST request of assets 
     /*clickSubmit(): void {
      
      this.dialogConfig.close();
     }*/
 }



