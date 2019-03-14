import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiFormComponent } from './fi-form.component';

describe('FiFormComponent', () => {
  let component: FiFormComponent;
  let fixture: ComponentFixture<FiFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
