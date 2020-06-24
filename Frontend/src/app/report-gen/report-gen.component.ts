import { Component, OnInit, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Asset } from '../asset';



export interface Vulnerability{
  vulnID: number,
  vulnName: string,
  vulnDescription: string,
  vulnSeverity: number,
  vulnDateDiscovered: string,
  vulnDateModified: string,
  vulnDateResolved: string,
  vulnActionPlan: string,
  vulnSolution: string,
  vulnAssetID: number,
  vulnStatus: string,
  vulnScanType: string,
  vulnReference: string,
  vulnCvssScore: number
}

export interface NewAsset {
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



var Asset_Data: NewAsset[]=[];

var Chosen_Assets: NewAsset[]=[];

@Component({
  selector: 'app-report-gen',
  templateUrl: './report-gen.component.html',
  styleUrls: ['./report-gen.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])]
})

export class ReportGenComponent implements OnInit {
  VULNERABILITY_DATA: Vulnerability[];

  expandAsset: NewAsset | null;

  executiveSummary;
  dataSource;
  displayedColumns = ['Name','Type', 'Owner', 'Host', 'Platform', 'Choose', 'Delete'];
  asCols = ['ID', 'Name', 'Desc', 'Type', 'Comp', 'Version', 'Feat', 'Host', 'Hist', 'Owner', 'Crit', 'Dept', 'Worth', 'Platform', 'Domain'];

  additionalNotes;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(public http: HttpClient, public datePipe: DatePipe) { }

  ngOnInit() {
    this.VULNERABILITY_DATA = [];
    this.additionalNotes = "";
    this.executiveSummary ="";
    this.fillAssets();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearDataSource(){
    var length = Asset_Data.length;
    for(var i = 0; i < length; i++){
      Asset_Data.pop();
    }
    this.dataSource = new MatTableDataSource(Asset_Data);
  }

  clearFields(){
    window.alert("All fields have been cleared! Ready for a new report!");
    var lengthOfChosenAssets = Chosen_Assets.length;
    for(var i = 0; i < lengthOfChosenAssets; i++){
      Chosen_Assets.pop();
    }
    var lengthOfVulns = this.VULNERABILITY_DATA.length;
    for(let i = 0; i < lengthOfVulns; i++){
      this.VULNERABILITY_DATA.pop();
    }
    this.additionalNotes = "";
    this.executiveSummary ="";
  }

  clearVulnData(){
    var lengthOfVulns = this.VULNERABILITY_DATA.length;
    for(let i = 0; i < lengthOfVulns; i++){
      this.VULNERABILITY_DATA.pop();
    }
  }

  assetChosen(asset){
    window.alert("Asset has been added to report!");
    let index = Asset_Data.indexOf(asset);
    if(!Chosen_Assets.includes(Asset_Data[index])){
      Chosen_Assets.push(Asset_Data[index]);
    }
  }

  removeAsset(asset){
    window.alert("Asset removed from report!");
    let index = Asset_Data.indexOf(asset);
    let updatedChosen_Assets: NewAsset [] = [];
    for(let i = 0; i < Chosen_Assets.length; i++){
      if(Chosen_Assets[i] != asset){
        updatedChosen_Assets.push(Chosen_Assets[i]);
      }
    }
    for(let i = 0; i < Chosen_Assets.length; i++){
      Chosen_Assets.pop();
    }
    Chosen_Assets = updatedChosen_Assets;
  }

  async fillAssets() {
    this.clearDataSource();

    var retAsset: NewAsset[];

    let theAsset = await this.http.get('https://127.0.0.1:8000/assets/?format=json').toPromise();
    var num_asset = Object.keys(theAsset).length;
    for(var i = 0; i < num_asset; i++){
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
  }

  async displayAll(){
    let TEMP_DATA: Vulnerability[]=[];
    let val = await this.http.get("https://127.0.0.1:8000/vulnerability/?format=json").toPromise()
    let count = Object.keys(val).length;
    let countOfChosen = Chosen_Assets.length;
    console.log(countOfChosen);
    for(var i = 0; i < count; i++){
      if(countOfChosen != 0){
        for(var j = 0; j < countOfChosen; j++){
          if(val[i].assetID == Chosen_Assets[j].ID){
            this.VULNERABILITY_DATA.push({vulnID: val[i].vulnID, vulnName: val[i].name, vulnDescription: val[i].description, vulnSeverity: val[i].severity, vulnDateDiscovered: val[i].dateDiscovered, vulnDateModified: val[i].dateModified, vulnDateResolved: val[i].dateResolved, vulnActionPlan: val[i].actionPlan, vulnSolution: val[i].solution, vulnAssetID: val[i].assetID, vulnStatus: val[i].status, vulnScanType: val[i].scanType, vulnReference: val[i].reference, vulnCvssScore: val[i].cvssScore});
          }
        }
      } else{
          this.VULNERABILITY_DATA.push({vulnID: val[i].vulnID, vulnName: val[i].name, vulnDescription: val[i].description, vulnSeverity: val[i].severity, vulnDateDiscovered: val[i].dateDiscovered, vulnDateModified: val[i].dateModified, vulnDateResolved: val[i].dateResolved, vulnActionPlan: val[i].actionPlan, vulnSolution: val[i].solution, vulnAssetID: val[i].assetID, vulnStatus: val[i].status, vulnScanType: val[i].scanType, vulnReference: val[i].reference, vulnCvssScore: val[i].cvssScore});
      }
        
    }
    this.download();
  }
  //

  async testTheAssetId(inVulnAssetId){
    let theAsset = await this.http.get<NewAsset>("https://127.0.0.1:8000/assets/?format=json").toPromise();
    let returnAsset: NewAsset = null;
    let newAsset: NewAsset [] = [];
    let count = Object.keys(theAsset).length;
    for(var i = 0; i < count; i++){
      newAsset.push({ ID: theAsset[i].id,
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
    for(var i =0; i< count; i++){
      let testingAsset: NewAsset;
      testingAsset = newAsset.pop();
      if(testingAsset.ID == inVulnAssetId){
        returnAsset = testingAsset;
      }
    }
    return returnAsset;
  }
  


  async download(){
    //this.displayAll();
      let name = "VMA_REPORT_"+ this.datePipe.transform(Date(), 'dd_MM_yyyy_HH:mm:ss');
      let pdf = new jsPDF('p','pt',[595,842]);
      pdf.page = 1;
      


      var img = new Image();
      img.src = "../../assets/VMA-Logo.png";
      pdf.addImage(img, 'png', 238, 50, 110, 150);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(40);
      pdf.text("VMA", 250, 280);

      pdf.setFontSize(20);
      pdf.text(name, 130, 380);

      pdf.setFontSize(10)
      pdf.text("Generated: "  + Date().toString(), "100", "480");
      pdf.setFont("helvetica", "normal");

      pdf.text(500,820, 'Page ' + pdf.page);
      pdf.text(55,820, 'VMA Vulnerability Report');
      pdf.page++;
      pdf.addPage();

      pdf.setFontSize(15)
      pdf.setFont("helvetica", "bold");
      pdf.text("Executive Summary", 50, 80);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      if(this.executiveSummary == ""){
        pdf.text("No Executive Summary Provided!", 50, 110);
      } else{
        pdf.text(pdf.splitTextToSize(this.executiveSummary, 500), 50, 110);
      }
      pdf.text(500,820, 'Page ' + pdf.page);
      pdf.text(55,820, 'VMA Vulnerability Report');
      pdf.page++;
      pdf.addPage();
      if(this.VULNERABILITY_DATA.length == 0){
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text("This Asset has no recorded vulnerabilities!", 80, 280);
      }

      for(var i = 0; i< this.VULNERABILITY_DATA.length; i++){
        pdf.setFontSize(30);
        pdf.setFont("helvetica", "bolditalic");
        pdf.text(50,80,"Vulnerability #"+(i+1));

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Vulnerability Info & Status", 50, 130);

        pdf.line(50, 160, 450, 160, "F");

        pdf.line(50, 190, 450, 190, "F");

        //pdf.line(50, 220, 450, 220, "F");

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        //pdf.line(55, 165, 55, 185, "F");

        //pdf.line(55, 195, 55, 215, "F");
        pdf.setFont("helvetica", "bold");
        pdf.text("Status", 64, 178);
        pdf.setFont("helvetica", "normal");
        pdf.text(this.VULNERABILITY_DATA[i].vulnStatus, 74, 210);
        pdf.line(101, 165, 101, 185, "F");
        //pdf.line(100, 195, 100, 215, "F");


        pdf.setFont("helvetica", "bold");
        pdf.text("Date Discovered", 110, 178);
        pdf.setFont("helvetica", "normal");
        if(this.VULNERABILITY_DATA[i].vulnDateResolved = null){
          pdf.text("",110, 210);
        } else{
          pdf.text(this.VULNERABILITY_DATA[i].vulnDateDiscovered.split('-').reverse().join('/'), 110, 210);
        }
        pdf.line(200, 165, 200, 185, "F");
        //pdf.line(200, 195, 200, 215, "F");


        pdf.setFont("helvetica", "bold");
        pdf.text("Date Modified", 210, 178);
        pdf.setFont("helvetica", "normal");
        pdf.text(this.VULNERABILITY_DATA[i].vulnDateModified.split('-').reverse().join('/'), 210, 210);
        pdf.line(285, 165, 285, 185, "F");
        //pdf.line(285, 195, 285, 215, "F");


        
        pdf.setFont("helvetica", "bold");
        pdf.text("Severity", 355, 178);
        pdf.setFont("helvetica", "normal");
        pdf.text(this.VULNERABILITY_DATA[i].vulnSeverity.toString(), 355, 210);
        //pdf.line(445, 165, 445, 185, "F");
        //pdf.line(445, 195, 445, 215, "F");


        let hopeThisWorks: NewAsset;

        await this.testTheAssetId(this.VULNERABILITY_DATA[i].vulnAssetID).then((AnotherThing =>{
          hopeThisWorks = AnotherThing;
        }));

        pdf.setFont("helvetica", "bold");
        pdf.text("Owner", 297, 178);
        pdf.setFont("helvetica", "normal");
        if(hopeThisWorks.Owner == null){
          pdf.text("No Owner!", 297, 210);
        } else{
          pdf.text(hopeThisWorks.Owner, 297, 210);
        }
        pdf.line(345, 165, 345, 185, "F");
        //pdf.line(345, 195, 345, 215, "F");






        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Vulnerability Name", 50,260);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(this.VULNERABILITY_DATA[i].vulnName, 50, 290);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Affected Asset", 50, 330);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        if(hopeThisWorks.Host == null){
          pdf.text("No Host Provided", 50, 360);
        } else{
          pdf.text(hopeThisWorks.Host, 50, 360);
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Vulnerability Description", 50, 400);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(pdf.splitTextToSize(this.VULNERABILITY_DATA[i].vulnDescription,500), 50, 430);
        pdf.text(500,820, 'Page ' + pdf.page);
        pdf.page++;
        pdf.text(55,820, 'VMA Vulnerability Report'); 
        pdf.addPage()

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Vulnerability Action Plan", 50, 60);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(pdf.splitTextToSize(this.VULNERABILITY_DATA[i].vulnActionPlan,500), 50, 90); 
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text("Vulnerability References", 50, 280);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(pdf.splitTextToSize(this.VULNERABILITY_DATA[i].vulnReference, 500), 50, 310);
        pdf.text(500,820, 'Page ' + pdf.page);
        pdf.text(55,820, 'VMA Vulnerability Report');
        pdf.page++;
        if(!(i+1 < this.VULNERABILITY_DATA.length)){

        } else{
          pdf.addPage();
        }   
      }
      
      pdf.addPage();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20)
      pdf.text("Additional Notes", 50, 60)
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      var additionalNotesToAdd = pdf.splitTextToSize(this.additionalNotes, 500);
      if(this.additionalNotes == ""){
        pdf.text("No additional notes!", 50, 90);
      } else{
        pdf.text(additionalNotesToAdd, 50, 90);
      }
      pdf.text(500,820, 'Page ' + pdf.page);
      pdf.text(55,820, 'VMA Vulnerability Report');
      pdf.page++;

      
      pdf.save(name+".pdf");
      //this.clearFields();
      window.alert("Report has been generated!");
      this.clearVulnData();      
  }

}

