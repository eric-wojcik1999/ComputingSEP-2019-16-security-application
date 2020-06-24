import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayVulnerabilitiesComponent } from './display-vulnerabilities.component';

describe('DisplayVulnerabilitiesComponent', () => {
  let component: DisplayVulnerabilitiesComponent;
  let fixture: ComponentFixture<DisplayVulnerabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayVulnerabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayVulnerabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
