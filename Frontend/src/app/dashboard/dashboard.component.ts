import { Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashboardApiService } from "./dashboard-api.service"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface Company{
  company: string;
  numProducts: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ["company", "numProducts"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private dashboardApiService: DashboardApiService, public dialog: MatDialog) { }

  ngOnInit() {
    // When page is loaded send GET request and create data table.
    this.dashboardApiService.getCompanyData().subscribe((data: Company[])=>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openVulnStat(): void {
    const dialogRef = this.dialog.open(VulnerabilityStatusOverviewDialog, {
      width: '80em',
      height: '45em'
    });
    dialogRef.afterClosed().subscribe(result => {
        var temp;
        temp = result;
    });
  }

  openSecBreak(): void {
    const dialogRef = this.dialog.open(SecurityBreakdownDialog, {
      width: '80em',
      height: '45em'
    });
    dialogRef.afterClosed().subscribe(result => {
          var temp;
          temp = result;
    });
  }

  openSecPrior(): void {
    const dialogRef = this.dialog.open(SecurityPrioritisationDialog, {
      width: '80em',
      height: '45em'
    });
    dialogRef.afterClosed().subscribe(result => {
          var temp;
          temp = result;    
    });
  }
}

// VSO Dialog
@Component({
    selector: 'vulnerability-status-overview-dialog',
    templateUrl: 'vulnerability-status-overview-dialog.html',
})

export class VulnerabilityStatusOverviewDialog {
    constructor(public dialogRef: MatDialogRef<VulnerabilityStatusOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: "") {}
}

// Security Breakdown Dialog
@Component({
    selector: 'security-breakdown-dialog',
    templateUrl: 'security-breakdown-dialog.html',
})

export class SecurityBreakdownDialog {
    constructor(public dialogRef: MatDialogRef<SecurityBreakdownDialog>,
    @Inject(MAT_DIALOG_DATA) public data: "") {}
}

// Security Priority Dialog
@Component({
    selector: 'security-prioritisation-dialog',
    templateUrl: 'security-prioritisation-dialog.html',
})

export class SecurityPrioritisationDialog {
  constructor(public dialogRef: MatDialogRef<SecurityPrioritisationDialog>,
  @Inject(MAT_DIALOG_DATA) public data: "") {}
}
  




