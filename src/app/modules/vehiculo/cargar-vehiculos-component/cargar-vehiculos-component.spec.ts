import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarVehiculosComponent } from './cargar-vehiculos-component';

describe('CargarVehiculosComponent', () => {
  let component: CargarVehiculosComponent;
  let fixture: ComponentFixture<CargarVehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarVehiculosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarVehiculosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
