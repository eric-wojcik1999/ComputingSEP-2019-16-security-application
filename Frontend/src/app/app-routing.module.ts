import { NgModule, Component }	            from '@angular/core';
import { Routes, RouterModule } 			      from '@angular/router';
import { ManualInputComponent } 			      from './manual-input/manual-input.component';
import { DashboardComponent } 				      from './dashboard/dashboard.component';
import { ReportGenComponent } 				      from './report-gen/report-gen.component';
import { LoginComponent }                   from './login/login.component';
import { AuthGuard } 						            from './auth.guard';
import { DisplayCompaniesComponent } 	      from './display-companies/display-companies.component';
import { DisplayVulnerabilitiesComponent } 	from './display-vulnerabilities/display-vulnerabilities.component';
import { DisplayAssetsComponent } 			    from './display-assets/display-assets.component';
import { MainLayoutComponent}               from './layout/main-layout/main-layout.component';
import { ManualInputVulComponent }          from './manual-input-vul/manual-input-vul.component';
import { UploadScansComponent }             from './upload-scans/upload-scans.component';
import { ManuallyManageAccountsComponent}   from './manually-manage-accounts/manually-manage-accounts.component'

const routes: Routes = [
  { path: 'man-asset',     					   component: MainLayoutComponent, children: [{path: '', component: ManualInputComponent}] },
  { path: 'dashboard',				         component: MainLayoutComponent, children: [{path: '', component: DashboardComponent}] },
  { path: 'report',      					     component: MainLayoutComponent, children: [{path: '', component: ReportGenComponent}] },
  { path: 'companies',                 component: MainLayoutComponent, children: [{path: '', component: DisplayCompaniesComponent}]},
  { path: "login", 							       component: LoginComponent, canActivate: [AuthGuard]},
  { path: "vulns",                  	 component: MainLayoutComponent, children: [{path: '', component: DisplayVulnerabilitiesComponent}]},
  { path: "assets", 				           component: MainLayoutComponent, children: [{path: '', component: DisplayAssetsComponent}] },
  { path: "man-vul", 			          	 component: MainLayoutComponent, children: [{path: '', component: ManualInputVulComponent}]},
  { path: "upload",        				     component: MainLayoutComponent, children: [{path: '', component: UploadScansComponent}]},
  { path: "man-acc",                   component: MainLayoutComponent, children: [{path: '', component: ManuallyManageAccountsComponent}]},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }