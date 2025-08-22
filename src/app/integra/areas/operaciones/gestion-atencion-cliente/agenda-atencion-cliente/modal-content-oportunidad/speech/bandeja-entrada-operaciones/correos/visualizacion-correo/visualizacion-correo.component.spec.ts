import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacionCorreoComponent } from './visualizacion-correo.component';

describe('VisualizacionCorreoComponent', () => {
  let component: VisualizacionCorreoComponent;
  let fixture: ComponentFixture<VisualizacionCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizacionCorreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizacionCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
