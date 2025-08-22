import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrigenDatosComponent } from './origen-datos.component';

describe('OrigenDatosComponent', () => {
  let component: OrigenDatosComponent;
  let fixture: ComponentFixture<OrigenDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrigenDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrigenDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
