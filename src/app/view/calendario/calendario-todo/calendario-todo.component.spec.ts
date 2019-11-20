import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTodoComponent } from './calendario-todo.component';

describe('CalendarioTodoComponent', () => {
  let component: CalendarioTodoComponent;
  let fixture: ComponentFixture<CalendarioTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
