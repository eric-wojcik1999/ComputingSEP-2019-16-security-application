import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPostureComponent } from './security-posture.component';

describe('SecurityPostureComponent', () => {
  let component: SecurityPostureComponent;
  let fixture: ComponentFixture<SecurityPostureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityPostureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPostureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
