import { TestBed } from '@angular/core/testing';

import { PuestoServices } from './puesto-services';

describe('PuestoServices', () => {
  let service: PuestoServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuestoServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
