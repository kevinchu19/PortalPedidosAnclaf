import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevopresupuestoComponent } from './nuevopresupuesto.component';

describe('NuevopresupuestoComponent', () => {
  let component: NuevopresupuestoComponent;
  let fixture: ComponentFixture<NuevopresupuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevopresupuestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevopresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
