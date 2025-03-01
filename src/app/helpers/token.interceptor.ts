import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiResponse } from "../types";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    private refreshTokenEndpointUrl = `http://172.207.18.25:8080/api/v1/auth/refresh`;

    constructor(private httpClient: HttpClient, private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.authService.getAccessToken();

        if (accessToken) {
            const authenticatedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const refreshToken = localStorage.getItem('REFRESH_TOKEN');

            return next.handle(authenticatedReq).pipe(
                catchError((error) => {
                    if (error.status === 401 && refreshToken) {
                        return this.httpClient.post<ApiResponse<string>>(this.refreshTokenEndpointUrl, {
                            refreshToken,
                            accessToken
                        }).pipe(
                            switchMap((newTokenResponse) => {
                                localStorage.setItem('ACCESS_TOKEN', newTokenResponse.data);

                                const newAuthenticatedReq = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${newTokenResponse.data}`
                                    }
                                });

                                return next.handle(newAuthenticatedReq);
                            }),
                            catchError((refreshError) => {
                                localStorage.removeItem('ACCESS_TOKEN');
                                localStorage.removeItem('REFRESH_TOKEN');
                                window.location.href = '/login';

                                return throwError(() => refreshError);
                            })
                        );
                    }

                    return throwError(() => error);
                })
            );
        }

        return next.handle(req);
    }
}