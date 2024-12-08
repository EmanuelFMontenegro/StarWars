import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsDetailComponent } from './planets-detail.component';

describe('PlanetsDetailComponent', () => {
  let component: PlanetsDetailComponent;
  let fixture: ComponentFixture<PlanetsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
