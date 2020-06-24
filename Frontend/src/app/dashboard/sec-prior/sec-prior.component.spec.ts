import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecPriorComponent } from './sec-prior.component';

describe('SecPriorComponent', () => {
  let component: SecPriorComponent;
  let fixture: ComponentFixture<SecPriorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecPriorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecPriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
