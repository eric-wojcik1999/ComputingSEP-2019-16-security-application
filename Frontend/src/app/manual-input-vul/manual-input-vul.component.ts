import { Component, OnInit, Inject } from '@angular/core';
// For the Form 
import { FormBuilder, FormGroup } from '@angular/forms';
// For Validation 
import { Validators } from '@angular/forms'
// For vulns
import { VulApiService } from './vul-api.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { GetAsset } from './getasset.service';



export interface VulDetailsPreview {
  vul_name: string;
  vul_desc: string;
  vul_status: string;
  vul_asset: string;  
  vul_sol: string;
  vul_sev: string;
  vul_scan: string;
  vul_ref: string;
  vul_cvs: string;
  vul_datedisc: string;
  vul_datemod: string;
  vul_dateres: string; 
  vul_plan: string;

}

// interface to display assets in form
export interface Asset{
    id: number;
    name: string;
}


@Component({
  selector: 'app-manual-input-vul',
  templateUrl: './manual-input-vul.component.html',
  styleUrls: ['./manual-input-vul.component.css'],
  providers: [VulApiService],
})

export class ManualInputVulComponent implements OnInit {
  // vulnID, date_modified --> both auto populated. scan_type set as 'M'
  // need to set up a search for Assets so vulnerability can be associated with it
  vulObject = {vulnID: -1, name: '', desc: '', severity: '', date_discovered: '', date_modified: '', date_resolved: '',
action_plan: '', solution: '', status: '', scan_type: 'M', reference: '', cvs_score:'', asset: ''};

// drop down options for status 
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

name: string; 

createVul = () => {
  this.api.createVul(this.vulObject).subscribe(
    data => {
      this.getVuls();
      alert('You have added a new vulnerability: ' + this.vul_details.get('vul_name').value);
    },
    error => {
      alert('Could not add vulnerability - check that you have entered the required fields' + '\n' + this.vul_details.get('vul_name').value
      )
      // specific error messages - these theoretically should not trigger as they are set to be required in the form 
      if(this.vul_details.get('vul_name').value == ""){
        alert('Name cannot be left blank');
      }
      if(this.vul_details.get('vul_sev)').value == ""){
        alert('Severity cannot be left blank');
      }
      if(this.vul_details.get('vul_datedisc').value == ""){
        alert('Date discovered cannot be left blank')
      }
      if(this.vul_details.get('vul_asset').value == ""){
        alert('Asset ID cannot be left blank');
      }
      if(this.vul_details.get('vul_status').value == ""){
        alert('Status cannot be left blank');
      }
      if(this.vul_details.get('vul_scan').value == ""){
        alert('Scan type cannot be left blank');
      }
      console.log(error);
    }
  );
}

getVuls = () => {
  this.api.getAllVuls().subscribe(
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
    private api: VulApiService,
    public dialog: MatDialog,
    private getAsset: GetAsset) { 
      this.getVuls();
    }
  openDialog(): void {
        const dialogConfig = this.dialog.open(PreviewVul, {
        width: '500px',
        height: '500px',
        data: { vul_name: this.vul_details.get('vul_name').value,
                vul_desc: this.vul_details.get('vul_desc').value,
                vul_status: this.vul_details.get('vul_status').value,
                vul_asset: this.vul_details.get('vul_asset').value,
                vul_sol: this.vul_details.get('vul_sol').value,
                vul_sev: this.vul_details.get('vul_sev').value,
                vul_scan: this.vul_details.get('vul_scan').value,
                vul_ref: this.vul_details.get('vul_ref').value,
                vul_cvs: this.vul_details.get('vul_cvs').value,
                vul_datedisc: this.vul_details.get('vul_datedisc').value,
                vul_datemod: this.vul_details.get('vul_datemod').value,
                vul_dateres: this.vul_details.get('vul_dateres').value,
                vul_plan: this.vul_details.get('vul_plan').value,
              }
      });
      
      dialogConfig.afterClosed().subscribe(result => {
        console.log('Dialog closed');
        this.name = result;
      });
    }

    ngOnInit() { // Get all of the Asset Data
      this.getAsset.getAssetData().subscribe((data: Asset[])=>{
        var length = Object.keys(data).length;
        this.assets = new Array<Asset>(length);
        for(var i=0; i<length; i++)
        {
            this.assets[i] = {id: data[i].id, name: data[i].name};
        }
    });
    }
  

    onSubmit() {
      console.warn(this.vul_details.value);
      console.log(this.vul_details.value);
      
      if(this.vul_details.get('vul_name').value == "")
      {
        alert('name cannot be blank');
        
      }
      this.vulObject.name = this.vul_details.get('vul_name').value;
      this.vulObject.desc = this.vul_details.get('vul_desc').value;
      this.vulObject.status = this.vul_details.get('vul_status').value;
      this.vulObject.asset = this.vul_details.get('vul_asset').value;
      this.vulObject.solution = this.vul_details.get('vul_sol').value;
      this.vulObject.severity = this.vul_details.get('vul_sev').value;
      this.vulObject.scan_type = this.vul_details.get('vul_scan').value;
      this.vulObject.reference = this.vul_details.get('vul_ref').value;
      // in case cvs gets left blank by user as technically not a "required" field
      if(this.vul_details.get('vul_cvs').value == ""){
        this.vulObject.cvs_score = '0';
      }
      else{
        this.vulObject.cvs_score = this.vul_details.get('vul_cvs').value;
      }

      // in case date discovered gets left  blank, set default to null 
      if(this.vul_details.get('vul_datedisc').value == ""){
        this.vulObject.date_discovered = null;
      }
      else {
        this.vulObject.date_discovered = this.vul_details.get('vul_datedisc').value;
      }
      
      // this will automatically be set to date vulnerabiltiy is added if left blank by user
      this.vulObject.date_modified = this.vul_details.get('vul_datemod').value;

      // set date resolved to null if left blank by user
      if(this.vul_details.get('vul_dateres').value == ""){
        this.vulObject.date_resolved = null;
      }
      else{
        this.vulObject.date_resolved = this.vul_details.get('vul_dateres').value;
      }

      this.vulObject.action_plan = this.vul_details.get('vul_plan').value;

      console.log(this.vulObject);
      this.createVul();
    }
}

// Pop up component
@Component({
  selector: 'preview-vul-dialog',
  templateUrl: 'preview-vul-dialog.html',
})

 export class PreviewVul {
  constructor(
    public dialogConfig: MatDialogRef<PreviewVul>, 
    @Inject(MAT_DIALOG_DATA) public data: VulDetailsPreview) {
      
     }

    clickCancel(): void {
      this.dialogConfig.close();
    }

    // This is what I will use to send POST request of assets 
   /* clickSubmit(): void {
     this.dialogConfig.close();
    }*/
}

