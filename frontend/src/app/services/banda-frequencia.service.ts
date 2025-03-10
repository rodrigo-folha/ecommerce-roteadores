import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BandaFrequencia } from '../models/banda-frequencia.model';

@Injectable({
  providedIn: 'root'
})
export class BandaFrequenciaService {
  private baseUrl = 'http://localhost:8080/bandafrequencias';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<BandaFrequencia[]> {
    return this.httpClient.get<BandaFrequencia[]>(this.baseUrl);
  }

  findById(id: String): Observable<BandaFrequencia> {
    return this.httpClient.get<BandaFrequencia>(`${this.baseUrl}/${id}`);
  }

  insert(bandafrequencia: BandaFrequencia): Observable<BandaFrequencia> {
    return this.httpClient.post<BandaFrequencia>(this.baseUrl, bandafrequencia);
  }

  update(bandafrequencia: BandaFrequencia): Observable<any> {
    return this.httpClient.put<BandaFrequencia>(`${this.baseUrl}/${bandafrequencia.id}`, bandafrequencia);
  }

  delete(bandafrequencia: BandaFrequencia): Observable<any> {
    return this.httpClient.delete<BandaFrequencia>(`${this.baseUrl}/${bandafrequencia.id}`);
  }
}
