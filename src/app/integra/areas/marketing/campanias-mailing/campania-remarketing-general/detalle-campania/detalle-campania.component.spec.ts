import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCampaniaComponent } from './detalle-campania.component';

describe('DetalleCampaniaComponent', () => {
  let component: DetalleCampaniaComponent;
  let fixture: ComponentFixture<DetalleCampaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCampaniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCampaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
