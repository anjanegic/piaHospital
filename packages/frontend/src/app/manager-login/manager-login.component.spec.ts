import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLoginComponent } from './manager-login.component';

describe('ManagerComponent', () => {
  let component: ManagerLoginComponent;
  let fixture: ComponentFixture<ManagerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
