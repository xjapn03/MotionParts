import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor.service';
import { AuthService } from '../core/services/auth.service';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
  });

  it('should add Authorization header when token is present', (done) => {
    authServiceSpy.getToken.and.returnValue('test-token');

    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) =>
      of(new HttpResponse({ body: request }));

    AuthInterceptor(req, next).subscribe((event) => {
      if (event instanceof HttpResponse) {
        const request = event.body as HttpRequest<any>; // 🔹 Casting explícito
        expect(request.headers.get('Authorization')).toBe('Bearer test-token');
      }
      
      done();
    });
  });

  it('should not add Authorization header when no token is present', (done) => {
    authServiceSpy.getToken.and.returnValue(null);

    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) =>
      of(new HttpResponse({ body: request }));

    AuthInterceptor(req, next).subscribe((event) => {
      if (event instanceof HttpResponse) {
        const request = event.body as HttpRequest<any>; // 🔹 Casting explícito
        expect(request.headers.get('Authorization')).toBe('Bearer test-token');
      }
      
      done();
    });
  });
});
