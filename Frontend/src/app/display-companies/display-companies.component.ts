import { Component, OnInit, ViewChild, ɵSWITCH_COMPILE_NGMODULE__POST_R3__, ViewChildren, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTable, MatPaginator, MatSort, MatSpinner } from '@angular/material';
import { NumberValueAccessor } from '@angular/forms';
import { templateJitUrl } from '@angular/compiler';
import { element } from 'protractor';

@Component({
  selector: 'app-display-companies',
  templateUrl: './display-companies.component.html',
  styleUrls: ['./display-companies.component.css']
})



export class DisplayCompaniesComponent implements OnInit, AfterViewInit {
  newValue = "";
  response;
  baseurl = 'https://127.0.0.1:8000';
  outputCompanyArray;
  numberOfEntries;
  displayedColumns = ["companyID", "companyName", "companyDescription", "companyNumProducts", "companySecurityPosture"];
  dataSource = new MatTableDataSource(COMPANY_DATA);

  @ViewChild(MatPaginator, {static: false}) paginator:MatPaginator;
  @ViewChild(MatSort, {static: true}) sort:MatSort;

  constructor(private http:HttpClient) { 

  }

  
  ngOnInit() {
    this.numberOfEntries = 0;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }


  /*displayAll(){
    COMPANY_DATA = []; //Should completely wipe all the previous values, as this will display everything.
    this.numberOfEntries = 0;
    /*this.http.get<Response>("/api/getAllCompanies").subscribe((val) => {
      this.outputCompanyArray = [];
      this.numberOfEntries = val.numCompanies;
      for(var i = 0; i < this.numberOfEntries; i++){
        this.outputCompanyArray = val.companies[i];
        COMPANY_DATA.push({companyID: this.outputCompanyArray[0], companyName: this.outputCompanyArray[1], companyDescription: this.outputCompanyArray[2], companyNumProducts: this.outputCompanyArray[3], companySecurityPosture: this.outputCompanyArray[4]});
      }
      this.updateDataSource();
    })

    this.http.get(this.baseurl + "/company/?format=json").subscribe((val) =>{
      var newEntry = [];
      var count = Object.keys(val).length;
      for(var i = 0; i < count; i++){
        COMPANY_DATA.push({companyID: val[i].id, companyName: val[i].name, companyDescription: val[i].description, companyNumProducts: val[i].numProducts, companySecurityPosture: val[i].securityPosture});
      }
      this.updateDataSource(count);
    });
  }*/

  /*notWithinDataSource(arrayEntry){
    var checkingValue = arrayEntry[0];
    for(var i=0; i<this.numberOfEntries; i++){
      if(COMPANY_DATA[i].companyID == checkingValue){
        return false;
      }
    }
    return true;
  }*/

  notWithinArray(singleArrayEntry, arrayToTest, arrayToTestCount){
    for(var i = 0; i<arrayToTestCount; i++){
      if(singleArrayEntry[0] == arrayToTest[i][0]){
        return false;
      }
    }
    return true;
  }

  updateDataSource(num){
    this.dataSource = new MatTableDataSource(COMPANY_DATA);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.numberOfEntries = num;
  }

  clearDataSource(){
    for(var i = 0; i < this.numberOfEntries; i++){
      COMPANY_DATA.pop();
    }
    this.numberOfEntries = 0;
    this.dataSource = new MatTableDataSource(COMPANY_DATA);
  }

  searchField(event){
    event.preventDefault();
    const target = event.target;
    var count = 0;

    this.clearDataSource();

    var fieldsToQueryArray = [];
    var valuesToQueryArray = [];
    var queryCount = 0;

    var companyName = target.querySelector('#companyNameID').value;
    var companyDescription = target.querySelector('#companyDescriptionID').value;
    var companyNumProducts = target.querySelector('#companyNumProductsID').value;
    var companySecurityPosture = target.querySelector('#companySecurityPostureID').value;
   
    if(companyName != ""){
      fieldsToQueryArray[queryCount] = "companyName";
      valuesToQueryArray[queryCount] = companyName;
      queryCount++;
    } else{
      fieldsToQueryArray[queryCount] = null;
      valuesToQueryArray[queryCount] = null;
      queryCount++;
    }
    if(companyDescription != ""){
      fieldsToQueryArray[queryCount] = "companyDescription";
      valuesToQueryArray[queryCount] = companyDescription;
      queryCount++;
    } else{
      fieldsToQueryArray[queryCount] = null;
      valuesToQueryArray[queryCount] = null;
      queryCount++;
    }

    if(companyNumProducts != ""){
      fieldsToQueryArray[queryCount] = "companyNumProducts";
      valuesToQueryArray[queryCount] = companyNumProducts;
      queryCount++;
    } else{
      fieldsToQueryArray[queryCount] = null;
      valuesToQueryArray[queryCount] = null;
      queryCount++;
    }
    
    if(companySecurityPosture != ""){
      fieldsToQueryArray[queryCount] = "companySecurityPosture";
      valuesToQueryArray[queryCount] = companySecurityPosture;
      queryCount++;
    } else{
      fieldsToQueryArray[queryCount] = null;
      valuesToQueryArray[queryCount] = null;
      queryCount++;
    }

    this.http.get(this.baseurl + "/company/?format=json").subscribe((val) =>{
      var newEntry = [];
      var count = Object.keys(val).length;
      var TEMP_DATA: Company [] = [];
      for(var i = 0; i < count; i++){
        TEMP_DATA.push({companyID: val[i].id, companyName: val[i].name, companyDescription: val[i].description, companyNumProducts: val[i].numProducts, companySecurityPosture: val[i].securityPosture});
      }

      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQueryArray[0] == null){
          return true;
        } else{
          return(v[fieldsToQueryArray[0]].toString().toLowerCase().includes(valuesToQueryArray[0].toLowerCase()));
        }
      });

      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQueryArray[1] == null){
          return true;
        } else{
          return(v[fieldsToQueryArray[1]].toString().toLowerCase().includes(valuesToQueryArray[1].toLowerCase()));
        }
      });

      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQueryArray[2] == null){
          return true;
        } else{
          return(v[fieldsToQueryArray[2]] == valuesToQueryArray[2]);
        }
      });

      TEMP_DATA =TEMP_DATA.filter(function(v, i){
        if(fieldsToQueryArray[3] == null){
          return true;
        } else{
          return(v[fieldsToQueryArray[3]] == valuesToQueryArray[3]);
        }
      });

      COMPANY_DATA = TEMP_DATA;


      this.updateDataSource(count);
    });


  }
}

export interface Company{
  companyID: number,
  companyName: string,
  companyDescription: string,
  companyNumProducts: number,
  companySecurityPosture: string
}

export interface Response{
  success: boolean,
  numCompanies: number,
  companies: [][]
}

var COMPANY_DATA: Company[] = [
  
];
