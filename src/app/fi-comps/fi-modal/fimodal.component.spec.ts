import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiModalComponent } from './fimodal.component';

describe('ModalComponent', () => {
  let component: FiModalComponent;
  let fixture: ComponentFixture<FiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
