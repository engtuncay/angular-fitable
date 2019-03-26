import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FimodalWrapperComponent } from './fimodal-wrapper.component';

describe('ModalComponent', () => {
  let component: FimodalWrapperComponent;
  let fixture: ComponentFixture<FimodalWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FimodalWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FimodalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
