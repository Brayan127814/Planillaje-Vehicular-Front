import { TestBed } from '@angular/core/testing';

import { ParqueaderoService } from './parqueadero-service';

describe('ParqueaderoService', () => {
  let service: ParqueaderoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParqueaderoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
