import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from '../dashboard-api.service';

@Component({
  selector: 'app-critical-asset-table',
  templateUrl: './critical-asset-table.component.html',
  styleUrls: ['./critical-asset-table.component.css']
})

export class CriticalAssetTableComponent implements OnInit {

  assetData = [];

  constructor(private dashboardApiService: DashboardApiService) { }

  ngOnInit() {
    // Selects 5 assets and displays them
    this.dashboardApiService.getAssetData().subscribe((data: any[])=>{
        var set = new Set();
        var length = Object.keys(data).length;
        var temp = [];
        var maxLength: number;

        while( (set.size < 5) && (set.size < length) )
        {
            var element = Math.floor(Math.random()*length);
            set.add(data[element]);
        }
        // Now add to the template
        set.forEach(function(x){
            temp.push(x);
        });

        // 5 is the highest number of elements that can be shown on the dashboard
        if(length < 5)
        {
            maxLength = length;
        }
        else
        {
            maxLength = 5;
        }
        
        for(var i=0; i<maxLength; i++)
        {
            this.assetData.push({"name":temp[i].name, "desc":temp[i].desc});
        }
    });
  }

}
