import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import {
  LoginResponse,
  SignupResponse,
  ForgotPasswordResponse,
  DashboardResponse,
  Property,
  PropertiesResponse,
  SettingsResponse,
  RevenueApiResponse,
  CustomersResponse,
  InvoicesResponse,
  HelpResponse,
  ActivityResponse,
  TeamResponse,
  CreateTeamMemberRequest,
  CreateTeamMemberResponse,
  DeleteTeamMemberResponse,
} from './api.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(catchError(this.handleError));
  }

  signup(payload: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    password: string;
    password_confirmation?: string;
  }): Observable<SignupResponse> {
    return this.http
      .post<SignupResponse>(`${this.baseUrl}/signup`, payload)
      .pipe(catchError(this.handleError));
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http
      .post<ForgotPasswordResponse>(`${this.baseUrl}/forgot_password`, { email })
      .pipe(catchError(this.handleError));
  }

  getDashboard(): Observable<DashboardResponse> {
    return this.http
      .get<DashboardResponse>(`${this.baseUrl}/dashboard`)
      .pipe(catchError(this.handleError));
  }

  getSettings(): Observable<SettingsResponse> {
    return this.http
      .get<SettingsResponse>(`${this.baseUrl}/settings`)
      .pipe(catchError(this.handleError));
  }

  updateSettings(data: { first_name: string; last_name: string; notifications_enabled: boolean }): Observable<{ message: string }> {
    return this.http
      .patch<{ message: string }>(`${this.baseUrl}/settings`, data)
      .pipe(catchError(this.handleError));
  }

  getRevenue(): Observable<RevenueApiResponse> {
    return this.http
      .get<RevenueApiResponse>(`${this.baseUrl}/revenue`)
      .pipe(catchError(this.handleError));
  }

  getCustomers(page = 1): Observable<CustomersResponse> {
    const key = `customers:${page}`;
    const cached = this.readCache<CustomersResponse>(key);
    const request = this.http
      .get<CustomersResponse>(`${this.baseUrl}/customers`, { params: { page: page.toString() } })
      .pipe(tap((res) => this.writeCache(key, res)), catchError(this.handleError));
    return cached ? of(cached).pipe(concatMap(() => request)) : request;
  }

  getActivity(page = 1): Observable<ActivityResponse> {
    const key = `activity:${page}`;
    const cached = this.readCache<ActivityResponse>(key);
    const request = this.http
      .get<ActivityResponse>(`${this.baseUrl}/activity`, { params: { page: page.toString() } })
      .pipe(tap((res) => this.writeCache(key, res)), catchError(this.handleError));
    return cached ? of(cached).pipe(concatMap(() => request)) : request;
  }

  getInvoices(page = 1): Observable<InvoicesResponse> {
    return this.http
      .get<InvoicesResponse>(`${this.baseUrl}/invoices`, { params: { page: page.toString() } })
      .pipe(catchError(this.handleError));
  }

  getHelp(): Observable<HelpResponse> {
    return this.http
      .get<HelpResponse>(`${this.baseUrl}/help`)
      .pipe(catchError(this.handleError));
  }

  getProperties(page = 1): Observable<PropertiesResponse> {
    return this.http
      .get<PropertiesResponse>(`${this.baseUrl}/properties`, { params: { page: page.toString() } })
      .pipe(catchError(this.handleError));
  }

  getProperty(id: number): Observable<Property> {
    return this.http
      .get<Property>(`${this.baseUrl}/properties/${id}`)
      .pipe(catchError(this.handleError));
  }

  createProperty(data: Partial<Property>): Observable<{ message: string; property: Property }> {
    return this.http
      .post<{ message: string; property: Property }>(`${this.baseUrl}/properties`, data)
      .pipe(catchError(this.handleError));
  }

  updateProperty(id: number, data: Partial<Property>): Observable<{ message: string; property: Property }> {
    return this.http
      .patch<{ message: string; property: Property }>(`${this.baseUrl}/properties/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteProperty(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/properties/${id}`)
      .pipe(catchError(this.handleError));
  }

  getTeam(): Observable<TeamResponse> {
    return this.http
      .get<TeamResponse>(`${this.baseUrl}/team`)
      .pipe(catchError(this.handleError));
  }

  createTeamMember(data: CreateTeamMemberRequest): Observable<CreateTeamMemberResponse> {
    return this.http
      .post<CreateTeamMemberResponse>(`${this.baseUrl}/team`, data)
      .pipe(catchError(this.handleError));
  }

  deleteTeamMember(id: number): Observable<DeleteTeamMemberResponse> {
    return this.http
      .delete<DeleteTeamMemberResponse>(`${this.baseUrl}/team/${id}`)
      .pipe(catchError(this.handleError));
  }

  private readCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as { t: number; v: T };
      if (Date.now() - entry.t > 5 * 60 * 1000) return null;
      return entry.v;
    } catch {
      return null;
    }
  }

  private writeCache<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
    } catch {
      /* ignore quota / serialization errors */
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else if (error.error?.error) {
      message = error.error.error;
    } else if (error.status === 0) {
      message = 'Unable to connect to the server';
    } else if (error.status === 401) {
      message = 'Invalid email or password';
    } else if (error.status === 403) {
      message = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
      message = 'The requested resource was not found';
    } else if (error.status === 422) {
      message = error.error?.details
        ? Object.values(error.error.details).flat().join(', ')
        : 'Invalid input';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later';
    }

    return throwError(() => ({ status: error.status, message }));
  }
}
