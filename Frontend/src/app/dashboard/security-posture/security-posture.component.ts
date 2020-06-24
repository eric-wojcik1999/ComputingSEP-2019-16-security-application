import { Component, OnInit } from '@angular/core';
import { DashboardApiService } from '../dashboard-api.service';

@Component({
  selector: 'app-security-posture',
  templateUrl: './security-posture.component.html',
  styleUrls: ['./security-posture.component.css']
})


export class SecurityPostureComponent implements OnInit {

  public doughnutChartLabels = [];
  public doughnutChartData = [];
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: any[] = [{
      backgroundColor: '',
      borderColor: ''
  }]

  constructor(private dashboardApiService: DashboardApiService) { }

  ngOnInit() {
    this.dashboardApiService.getCompanyData().subscribe((data: any[])=>{

        var colorSelect: Array<String>;
        var labels: Array<String>;
        var secPos: Array<number>;
        var colors: Array<String>;

        var length = Object.keys(data).length;
        labels = new Array<String>(length);
        secPos = new Array<number>(length);
        colors = new Array<String>(length);
        colorSelect = ['#D50B53', '#003D73', '#A882C1', '#824CA7', '#B9C406'];
        for(var i=0; i<length; i++)
        {
            labels[i] = data[i].name;
            secPos[i] = data[i].securityPosture;
            colors[i] = colorSelect[i%5];
        }        
        this.doughnutChartLabels = labels;
        this.doughnutChartData = secPos;
        this.doughnutChartColors = [{backgroundColor:colors, borderColor:'white'}];

    });
  }

}
