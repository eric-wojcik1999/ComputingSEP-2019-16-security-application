import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { MainLayoutComponent }from './main-layout/main-layout.component';
import { HeaderComponent }    from './header/header.component';
import { SidebarComponent }   from './sidebar/sidebar.component';
import { RouterModule }       from '@angular/router';
import { FlexLayoutModule }   from '@angular/flex-layout';
import { MatMenuModule}       from '@angular/material/menu';
import { MatSelectModule }    from '@angular/material/select';
// import { MatSidenavModule, MatListModule }   from '@angular/material/';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    FlexLayoutModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule, 
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    MainLayoutComponent
  ],
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent
  ]
})
export class LayoutModule { }
