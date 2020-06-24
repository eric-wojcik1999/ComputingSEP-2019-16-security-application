import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DashboardApiService } from "../dashboard-api.service"


export interface Asset{
  name: string;
  desc: string;
  owner: string;
  company: string;
  busCrit: string;
  estWorth: number;
}

@Component({
  selector: 'app-sec-prior',
  templateUrl: './sec-prior.component.html',
  styleUrls: ['./sec-prior.component.css']
})

export class SecPriorComponent implements OnInit {

  displayedColumns: string[] = ["name", "desc", "owner", "company", "busCrit", "estWorth"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private dashboardApiService: DashboardApiService) { }

  ngOnInit() {
    this.dashboardApiService.getAssetData().subscribe((data: Asset[])=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

}
