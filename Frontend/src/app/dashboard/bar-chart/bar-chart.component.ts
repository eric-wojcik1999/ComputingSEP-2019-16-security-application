import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from "../dashboard-api.service"
import { defaultColors } from 'ng2-charts';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit {
  constructor(private dashboardApiService : DashboardApiService) { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
  public barChartType = 'bar';
  public barChartLegend = true;

  /* Container to hold data */
  public barChartData = [
    {data: [], label: ''}
  ];

  ngOnInit() {
      var noneCount, lowCount, mediumCount, highCount, vHighCount :number;
      var busNone, busVLow, busLow, busMed, busHigh, busVHigh : number;

      noneCount = 0;
      lowCount = 0;
      mediumCount = 0;
      highCount = 0;
      vHighCount = 0;
      busNone = 0;
      busLow = 0;
      busMed = 0;
      busHigh = 0;
      busVHigh = 0;

      // Query the vulnerability
      this.dashboardApiService.getVulnerabilityData().subscribe((apiData: any[])=>{
        /* Severity ranges:
            None: 0
            Low: 1-25
            Medium: 25-50
            High: 50-75
            Very High: 75-100
        */
        var length = Object.keys(apiData).length;
        for(var i=0; i<length; i++)
        {
            // None case
            if(apiData[i].severity <= 0)
            {
                 noneCount++;
            }
            // Low
            else if( (apiData[i].severity >= 1) && (apiData[i].severity <= 25) )
            {
                lowCount++;
            }
            // Medium
            else if ( (apiData[i].severity > 25) && (apiData[i].severity <= 50) )
            {
                mediumCount++;
            }
            // High
            else if ( (apiData[i].severity > 50) && (apiData[i].severity <=75) )
            {
                highCount++;
            }
            // Very High
            else
            {
                vHighCount++;
            }
        }
        this.barChartData = [{data: [noneCount, lowCount, mediumCount, highCount, vHighCount], label: "Total Vulnerabilities"},
                             {data: [busNone, busLow, busVLow, busMed, busHigh, busVHigh], label: "Business Criticality of Assets"}
                            ];
      });

      // Query the Assets to gather the business critically
      this.dashboardApiService.getAssetData().subscribe((data: any[])=>{
          var length = Object.keys(data).length;
          for(var i=0; i<length; i++)
          {
              // None
              if(data[i].business_crit == "0")
              {
                  busNone++;
              }
              // Very Low
              else if(data[i].business_crit == "VL")
              {
                  busVLow++;
              }
              // Low
              else if(data[i].business_crit == "L")
              {
                  busLow++;
              }
              // Medium
              else if(data[i].business_crit == "M")
              {
                  busMed++;
              }
              // High
              else if(data[i].business_crit == "H")
              {
                  busHigh++;
              }
              // Very High
              else
              {
                  busVHigh++;
              }
          }
          this.barChartData = [{data: [noneCount, lowCount, mediumCount, highCount, vHighCount], label: "Total Vulnerabilities"},
                           {data: [busNone, busLow, busVLow, busMed, busHigh, busVHigh], label: "Business Criticality of Assets"}
                          ];
      });

  }
}
