import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaArgumentosComponent } from './categoria-argumentos.component';

describe('CategoriaArgumentosComponent', () => {
  let component: CategoriaArgumentosComponent;
  let fixture: ComponentFixture<CategoriaArgumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaArgumentosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaArgumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
