import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEstudiantesComponent } from './dashboard-estudiantes.component';

describe('DashboardEstudiantesComponent', () => {
  let component: DashboardEstudiantesComponent;
  let fixture: ComponentFixture<DashboardEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEstudiantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
