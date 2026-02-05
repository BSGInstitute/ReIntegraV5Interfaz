import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaniaRemarketingGeneralComponent } from './campania-remarketing-general.component';

describe('CampaniaRemarketingGeneralComponent', () => {
  let component: CampaniaRemarketingGeneralComponent;
  let fixture: ComponentFixture<CampaniaRemarketingGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaniaRemarketingGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaniaRemarketingGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
