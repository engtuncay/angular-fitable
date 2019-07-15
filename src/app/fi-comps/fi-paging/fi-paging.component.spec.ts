import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiPagingComponent } from './fi-paging.component';

describe('FiPagingComponent', () => {
  let component: FiPagingComponent;
  let fixture: ComponentFixture<FiPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
