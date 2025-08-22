import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedaccionCorreoComponent } from './redaccion-correo.component';

describe('RedaccionCorreoComponent', () => {
  let component: RedaccionCorreoComponent;
  let fixture: ComponentFixture<RedaccionCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedaccionCorreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedaccionCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
