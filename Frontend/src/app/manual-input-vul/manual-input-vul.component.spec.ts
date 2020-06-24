import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInputVulComponent } from './manual-input-vul.component';

describe('ManualInputVulComponent', () => {
  let component: ManualInputVulComponent;
  let fixture: ComponentFixture<ManualInputVulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInputVulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInputVulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
