import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioAulasComponent } from './calendario-aulas.component';

describe('CalendarioAulasComponent', () => {
  let component: CalendarioAulasComponent;
  let fixture: ComponentFixture<CalendarioAulasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioAulasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioAulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
