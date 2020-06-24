import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ManualInputComponent, PreviewAsset } from './manual-input/manual-input.component';
import { ReportGenComponent } from './report-gen/report-gen.component';
import { DashboardComponent, VulnerabilityStatusOverviewDialog, SecurityPrioritisationDialog, SecurityBreakdownDialog } from './dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatSidenavModule, MatListModule, MAT_DIALOG_DEFAULT_OPTIONS, MatInputModule, MAT_DIALOG_DATA, MatPaginator, MatPaginatorModule, MatSortModule, MatDialogRef, MatList} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Forms input
import { AssetInputFormComponent } from './asset-input-form/asset-input-form.component';
import { FormsModule } from '@angular/forms';
// import for reactive forms 
import { ReactiveFormsModule } from '@angular/forms';
// Dialog box 
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatDialogModule } from "@angular/material";
//HTTP import
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// The Rest
import { DisplayVulnerabilitiesComponent, PreviewVulnerability, ActionPlanDialog } from './display-vulnerabilities/display-vulnerabilities.component';
import { DisplayAssetsComponent } from './display-assets/display-assets.component';
import { LayoutModule } from './layout/layout.module';
import { DisplayCompaniesComponent } from './display-companies/display-companies.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { ManualInputMessagesComponent } from './manual-input-messages/manual-input-messages.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtInterceptor } from './jwt.interceptor';
// import for Manual Input Vulnerability 
import { ManualInputVulComponent, PreviewVul } from './manual-input-vul/manual-input-vul.component';
// Added dependency for charts + Dashboard stuff
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './dashboard/bar-chart/bar-chart.component';
import { LineChartComponent } from './dashboard/line-chart/line-chart.component';
import { CriticalAssetTableComponent } from './dashboard/critical-asset-table/critical-asset-table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OverlayModule, ScrollStrategyOptions, ScrollDispatcher, ViewportRuler, OverlayContainer, OverlayPositionBuilder, OverlayKeyboardDispatcher } from "@angular/cdk/overlay";
import { DashboardApiService } from './dashboard/dashboard-api.service';
// for upload scans 
import { UploadScansComponent } from './upload-scans/upload-scans.component';
import { UploadService } from './upload-scans/upload.service';
import { SecPriorComponent } from './dashboard/sec-prior/sec-prior.component';
import { RadarChartComponent } from './dashboard/radar-chart/radar-chart.component';
import { SecurityPostureComponent } from './dashboard/security-posture/security-posture.component';
// Manually Manage Accounts
import { ManuallyManageAccountsComponent, AddUserDialog, DeleteUserDialog, EditUserDialog } from './manually-manage-accounts/manually-manage-accounts.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AddUserFormComponent } from './manually-manage-accounts/add-user-form/add-user-form.component';
// Please don't delete anything under this or Chris will be sad
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { FocusMonitor, AriaDescriber, FocusTrapFactory, InteractivityChecker, LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { CdkObserveContent, ContentObserver } from '@angular/cdk/observers';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ManualInputComponent,
    ReportGenComponent,
    DashboardComponent,
    AssetInputFormComponent,
    PreviewAsset,
    DisplayVulnerabilitiesComponent,
    DisplayAssetsComponent,
    DisplayCompaniesComponent,
    AssetDetailsComponent,
    ManualInputMessagesComponent,
    PreviewVulnerability,
    ActionPlanDialog,
    ManualInputVulComponent,
    BarChartComponent,
    LineChartComponent,
    CriticalAssetTableComponent,
    VulnerabilityStatusOverviewDialog,
    SecurityBreakdownDialog,
    SecurityPrioritisationDialog,
    ManuallyManageAccountsComponent,
    // for upload scans 
    UploadScansComponent, 
    // for preview vuln
    PreviewVul, SecPriorComponent, RadarChartComponent, SecurityPostureComponent,
    AddUserDialog,
    DeleteUserDialog,
    AddUserFormComponent,
    EditUserDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // dummy imports for placeholder sidebar 
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
    FormsModule,
    // for reactive form 
    ReactiveFormsModule,
    // for Dialog box
    MatInputModule, 
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule, 
    MatTableModule,
    MatFormFieldModule,
    MatDialogModule,
    LayoutModule,
    MatMenuModule,
    MatSelectModule,
    // for HTTPClientInMemory (test manual Asset entry)
    HttpClientModule, // this is used to contact Django server  
    MatProgressSpinnerModule,
    FlexLayoutModule,
    ChartsModule,
    // For upload scans
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    OverlayModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    

  ],
  providers: [DashboardApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    { provide: MatDialogRef, useValue:{}},
    { provide: MAT_DIALOG_DATA, useValue: []},
    { provide: UploadService },
    Directionality,
    ScrollStrategyOptions,
    ScrollDispatcher,
    Platform,
    ViewportRuler,
    OverlayContainer,
    OverlayPositionBuilder,
    OverlayKeyboardDispatcher,
    FocusMonitor,
    AriaDescriber, 
    FocusTrapFactory,
    InteractivityChecker,
    BreakpointObserver,
    CdkObserveContent,
    ContentObserver,
    UniqueSelectionDispatcher,
    AutofillMonitor,
    LiveAnnouncer,
    MatSelectModule,
    DatePipe,
    MediaMatcher
  ],
  bootstrap: [AppComponent],
  entryComponents: [PreviewAsset, PreviewVulnerability, ActionPlanDialog, UploadScansComponent, PreviewVul, 
                    VulnerabilityStatusOverviewDialog, SecurityPrioritisationDialog, SecurityBreakdownDialog,
                    AddUserDialog, DeleteUserDialog, EditUserDialog]
})
export class AppModule { }
