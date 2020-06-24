import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuallyManageAccountsComponent } from './manually-manage-accounts.component';

describe('ManuallyManageAccountsComponent', () => {
  let component: ManuallyManageAccountsComponent;
  let fixture: ComponentFixture<ManuallyManageAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuallyManageAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuallyManageAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
