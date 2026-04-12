import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillajeComponent } from './planillaje-component';

describe('PlanillajeComponent', () => {
  let component: PlanillajeComponent;
  let fixture: ComponentFixture<PlanillajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanillajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanillajeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
