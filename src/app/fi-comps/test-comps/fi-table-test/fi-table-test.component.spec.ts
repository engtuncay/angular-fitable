/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FiTableTestComponent } from './fi-table-test.component';

describe('TestCompComponent', () => {
  let component: FiTableTestComponent;
  let fixture: ComponentFixture<FiTableTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiTableTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiTableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
