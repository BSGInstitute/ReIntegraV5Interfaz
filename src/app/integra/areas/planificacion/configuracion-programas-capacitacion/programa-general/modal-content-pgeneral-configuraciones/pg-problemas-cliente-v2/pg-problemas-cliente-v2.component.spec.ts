import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProblemasClienteV2Component } from './pg-problemas-cliente-v2.component';

describe('PgProblemasClienteV2Component', () => {
  let component: PgProblemasClienteV2Component;
  let fixture: ComponentFixture<PgProblemasClienteV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgProblemasClienteV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgProblemasClienteV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
