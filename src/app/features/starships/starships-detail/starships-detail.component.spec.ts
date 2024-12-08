import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarshipsDetailComponent } from './starships-detail.component';

describe('StarshipsDetailComponent', () => {
  let component: StarshipsDetailComponent;
  let fixture: ComponentFixture<StarshipsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarshipsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
