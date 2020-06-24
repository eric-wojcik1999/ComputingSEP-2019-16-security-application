import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInputMessagesComponent } from './manual-input-messages.component';

describe('ManualInputMessagesComponent', () => {
  let component: ManualInputMessagesComponent;
  let fixture: ComponentFixture<ManualInputMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInputMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInputMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
