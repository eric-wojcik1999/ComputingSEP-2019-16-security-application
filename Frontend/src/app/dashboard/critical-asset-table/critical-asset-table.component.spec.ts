import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalAssetTableComponent } from './critical-asset-table.component';

describe('CriticalAssetTableComponent', () => {
  let component: CriticalAssetTableComponent;
  let fixture: ComponentFixture<CriticalAssetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalAssetTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalAssetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
