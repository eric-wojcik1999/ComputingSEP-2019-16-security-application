import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInputFormComponent } from './asset-input-form.component';

describe('AssetInputFormComponent', () => {
  let component: AssetInputFormComponent;
  let fixture: ComponentFixture<AssetInputFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetInputFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
