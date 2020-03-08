import { TestBed } from '@angular/core/testing';

import { NgGstcService } from './ng-gstc.service';

describe('NgGstcService', () => {
  let service: NgGstcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgGstcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
