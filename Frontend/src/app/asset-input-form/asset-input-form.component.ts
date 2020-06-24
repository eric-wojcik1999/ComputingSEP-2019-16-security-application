import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset-fields';

@Component({
  selector: 'app-asset-input-form',
  templateUrl: './asset-input-form.component.html',
  styleUrls: ['./asset-input-form.component.css']
})
export class AssetInputFormComponent implements OnInit {

  // may not need these 2
    //asset_type = ['workstation', 'laptop', 'software'];
    //model = new Asset("Asset", "Low", "Manager", "Origin", "Department", "Yes", this.asset_type[0], "123.456.678", "Assigned to", 100, ["Alice", "Bob"], "some.csv", "Report", "Company", "Criticality", "Platform", ["Vulnerabiltiy", "Tags"], "Patch", "Planned activities", "History", "Notes")
  

  submitted = false;

  onSubmit() {this.submitted = true;}


  constructor() { }

  ngOnInit() {
  }

}
