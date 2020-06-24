import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from '../dashboard-api.service';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit {

  public radarChartLabels = ['Zap', 'Nessus', 'Nexpose', 'Nmap', 'Manual Input'];
  public radarChartData = [
    {data: [], label: ""}
  ];

  public radarChartType = 'radar';
  constructor(private dashboardApiService: DashboardApiService) { }

  ngOnInit() {
    this.dashboardApiService.getVulnerabilityData().subscribe((data: any[])=>{

        var sumZap, sumNessus, sumNexpose, sumNmap, sumManIn: number;
        var countZap, countNessus, countNexpose, countNmap, countManIn: number;
        var avgZap, avgNessus, avgNexpose, avgNmap, avgManIn: number;


        sumZap = 0;
        sumNessus = 0;
        sumNexpose = 0;
        sumNmap = 0;
        sumManIn = 0;
        countZap = 0;
        countNessus = 0;
        countNexpose = 0;
        countNmap = 0;
        countManIn = 0;
        
        // Totaling each element in JSON array
        var length = Object.keys(data).length;
        for(var i=0; i<length; i++)
        {
            // Zap
            if(data[i].scanType == "Z")
            {
                sumZap += data[i].severity;
                countZap++;
            }
            // Nessus
            else if(data[i].scanType == "Nes")
            {
                sumNessus += data[i].severity;
                countNessus++;
            }

            else if(data[i].scanType == "Nex")
            {
                sumNexpose += data[i].severity;
                countNexpose++
            }
            // Nmap
            else if(data[i].scanType == "Nm")
            {
                sumNmap += data[i].severity;
                countNmap++;
            }
            // Manual Input
            else if(data[i].scanType == "M")
            {
                sumManIn += data[i].severity;
                countManIn++;
            }
        }
        
        // Calculate Averages
        avgZap = sumZap/countZap;
        avgNessus = sumNessus/countNessus;
        avgNexpose = sumNexpose/countNexpose;
        avgNmap = sumNmap/countNmap;
        avgManIn = sumManIn/countManIn;

        // Create Radar
        this.radarChartData = [{data: [avgZap, avgNessus, avgNexpose, avgNmap, avgManIn], label:"Average severity score of vulnerabilities per scan"}];




    });

  }

}
