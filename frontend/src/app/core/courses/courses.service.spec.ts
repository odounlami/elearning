import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { API_BASE_URL } from '../config';

describe('CoursesService', () => {
  let service: CoursesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CoursesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the public catalogue', () => {
    service.list().subscribe();

    const request = http.expectOne(API_BASE_URL + '/courses');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('loads a course detail', () => {
    service.get(3).subscribe();

    const request = http.expectOne(API_BASE_URL + '/courses/3');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('enrolls the current user in a course', () => {
    service.enroll(3).subscribe();

    const request = http.expectOne(API_BASE_URL + '/courses/3/enroll');
    expect(request.request.method).toBe('POST');
    request.flush({});
  });

  it('marks a module as complete', () => {
    service.completeModule(8).subscribe();

    const request = http.expectOne(API_BASE_URL + '/modules/8/complete');
    expect(request.request.method).toBe('POST');
    request.flush({});
  });
});
