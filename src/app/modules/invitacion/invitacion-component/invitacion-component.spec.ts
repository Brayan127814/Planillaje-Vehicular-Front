import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitacionComponent } from './invitacion-component';

describe('InvitacionComponent', () => {
  let component: InvitacionComponent;
  let fixture: ComponentFixture<InvitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitacionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
