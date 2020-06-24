import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAssetsComponent } from './display-assets.component';

describe('DisplayAssetsComponent', () => {
  let component: DisplayAssetsComponent;
  let fixture: ComponentFixture<DisplayAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
