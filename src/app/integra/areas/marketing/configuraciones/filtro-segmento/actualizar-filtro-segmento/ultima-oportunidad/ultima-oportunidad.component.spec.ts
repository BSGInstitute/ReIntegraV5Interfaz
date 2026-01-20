import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimaOportunidadComponent } from './ultima-oportunidad.component';

describe('UltimaOportunidadComponent', () => {
  let component: UltimaOportunidadComponent;
  let fixture: ComponentFixture<UltimaOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UltimaOportunidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimaOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
