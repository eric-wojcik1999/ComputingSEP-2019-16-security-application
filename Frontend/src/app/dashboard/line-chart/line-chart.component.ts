import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DashboardApiService } from '../dashboard-api.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    {data: [], label: '' },
  ];

  public lineChartLabels: Label[] = [];

  public lineChartColors: Color[] = [
  {
      borderColor: 'black',
      backgroundColor: 'rgba(137,156,240,0.3)',
  }];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private dashboardApiService:DashboardApiService) { }

  ngOnInit() {
    // Recieve data about the line chart from backend
    this.dashboardApiService.getVulnerabilityData().subscribe((data: any[])=>{
      // Hold the months
      var monthSet = new Set();
      //var labels = [];
      // Index 0 represents January and index 11 represents December
      var monthDisCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var monthResCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


      var length = Object.keys(data).length;
      /* For each item in the JSON array extract each month from dateDiscovered */
      for(var i=0; i<length; i++)
      {
          var dateDis, dateRes: String;
          var monthDis, monthRes: number;

          dateDis = data[i].dateDiscovered;
          dateRes = data[i].dateResolved;


          if(dateRes != null)
          {
              monthDis = Number(dateDis.split("-")[1]);    // Extracts the month field
              monthRes = Number(dateRes.split("-")[1]);
    
              // Increment the monthDisCount and monthResCount arrays
              monthDisCount[monthDis-1] += 1;
              monthResCount[monthRes-1] += 1;
              
              monthSet.add(monthDis);
              monthSet.add(monthRes);
          }
          else
          {
              monthDis = Number(dateDis.split("-")[1]);    // Extracts the month field
                  
              // Increment the monthDisCount and monthResCount arrays
              monthDisCount[monthDis-1] += 1;
              
              monthSet.add(monthDis);
          }






          
          

          
      }

      var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                        "Oct", "Nov", "Dec"];
      // Build the labels list
      monthSet.forEach(function(i)
      {
          //labels.push(monthList[i-1])
      });
      

      // Draw the line chart
      this.lineChartData = [{data: monthDisCount, label: "Total Vulnerabilities Discovered/Time" },
                            {data: monthResCount, label: "Total Vulnerabilities Resolved/Time"}
                           ];
      this.lineChartLabels = monthList;
    });

  }

}
