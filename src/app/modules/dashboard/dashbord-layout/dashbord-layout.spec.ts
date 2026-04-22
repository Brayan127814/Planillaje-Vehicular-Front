import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordLayout } from './dashbord-layout';

describe('DashbordLayout', () => {
  let component: DashbordLayout;
  let fixture: ComponentFixture<DashbordLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbordLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
