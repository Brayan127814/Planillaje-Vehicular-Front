import { TestBed } from '@angular/core/testing';

import { PlanillajeService } from './planillaje-service';

describe('PlanillajeService', () => {
  let service: PlanillajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanillajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
