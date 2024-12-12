import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlanetsService } from './planets.service';

describe('PlanetsService', () => {
  let service: PlanetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PlanetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
