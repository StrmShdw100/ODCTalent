import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MissionResponse } from './mission.model';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:8080/api/v1/missions';

  constructor(private http: HttpClient) {}

  getAllMissions(): Observable<MissionResponse[]> {
    return this.http.get<MissionResponse[]>(this.apiUrl);
  }

  getMissionById(id: number): Observable<MissionResponse> {
    return this.http.get<MissionResponse>(`${this.apiUrl}/${id}`);
  }
}