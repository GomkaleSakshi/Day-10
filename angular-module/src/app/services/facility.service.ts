import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Facility } from '../models/facility.model';

@Injectable({ providedIn: 'root' })
export class FacilityService {
  private readonly apiUrl = `${environment.apiUrl}/facilities`;

  constructor(private http: HttpClient) {}

  getFacilities(filters?: { search?: string; status?: string }): Observable<{ success: boolean; data: Facility[] }> {
    let params = new HttpParams();

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<{ success: boolean; data: Facility[] }>(this.apiUrl, { params });
  }

  createFacility(payload: Partial<Facility>) {
    return this.http.post<{ success: boolean; data: Facility; message: string }>(this.apiUrl, payload);
  }

  updateFacility(id: number, payload: Partial<Facility>) {
    return this.http.patch<{ success: boolean; data: Facility; message: string }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteFacility(id: number) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
