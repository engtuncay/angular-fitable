import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FiModalTestComponent } from "./fi-modal-test.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("Test2Component", () => {

  let fixture: ComponentFixture<FiModalTestComponent>;
  let component: FiModalTestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [FiModalTestComponent]
    });

    fixture = TestBed.createComponent(FiModalTestComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
