import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueaderoComponent } from './parqueadero-component';

describe('ParqueaderoComponent', () => {
  let component: ParqueaderoComponent;
  let fixture: ComponentFixture<ParqueaderoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParqueaderoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParqueaderoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
