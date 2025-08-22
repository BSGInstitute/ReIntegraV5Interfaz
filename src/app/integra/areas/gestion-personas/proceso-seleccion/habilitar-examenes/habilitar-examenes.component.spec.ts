import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitarExamenesComponent } from './habilitar-examenes.component';

describe('HabilitarExamenesComponent', () => {
  let component: HabilitarExamenesComponent;
  let fixture: ComponentFixture<HabilitarExamenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabilitarExamenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitarExamenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
