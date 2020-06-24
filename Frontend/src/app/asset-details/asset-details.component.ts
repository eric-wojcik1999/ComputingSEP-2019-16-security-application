import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset-fields';


@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {
  asset: Asset = {
    asset_name: 'Asset Name',
    asset_sev_level: 'Asset Severity',
    asset_manager: 'Asset Manager',
    asset_origin: 'Asset Origin',
    asset_dept: 'Asset Dept',
    asset_solved: 'Asst Solved',
    asset_type: 'Asset Type',
    asset_subnet: 'Asset Subnet',
    asset_assigned_to: 'Asset Assigned To',
    asset_worth: 'Asset Worth',
    asset_auth_users: 'Asset Users',
    asset_csv: 'Asset CSV',
    asset_report: 'Asset Report',
    asset_company: 'Asset Company',
    asset_business_crit: 'Asset Crit',
    asset_platform: 'Asset Platform',
    asset_vul_tags: 'Asset Vul Tags',
    asset_fix: 'Asset fix',
    asset_planned_actions: 'Asset Planned Actions',
    asset_history: 'Asset History',
    asset_notes: 'Asset Notes'
  };

  constructor() { }

  ngOnInit() {
  }

}
