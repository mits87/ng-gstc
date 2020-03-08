import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGstcComponent } from './ng-gstc.component';

describe('NgGstcComponent', () => {
  let component: NgGstcComponent;
  let fixture: ComponentFixture<NgGstcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgGstcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgGstcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
