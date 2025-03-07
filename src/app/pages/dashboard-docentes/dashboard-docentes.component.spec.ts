import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDocentesComponent } from './dashboard-docentes.component';

describe('DashboardDocentesComponent', () => {
  let component: DashboardDocentesComponent;
  let fixture: ComponentFixture<DashboardDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDocentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
