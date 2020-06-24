import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScansComponent } from './upload-scans.component';

describe('UploadScansComponent', () => {
  let component: UploadScansComponent;
  let fixture: ComponentFixture<UploadScansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadScansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadScansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
