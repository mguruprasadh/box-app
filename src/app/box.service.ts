import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Box } from './box.model';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  private apiUrl = 'http://localhost:3000/boxes'; // URL to your Express API

  constructor(private http: HttpClient) {}

  // Get all boxes
  getBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>(this.apiUrl);
  }

  // Get a single box by ID
  getBoxById(id: number): Observable<Box> {
    return this.http.get<Box>(`${this.apiUrl}/${id}`);
  }

  // Create a new box
  createBox(box: Box): Observable<Box> {
    return this.http.post<Box>(this.apiUrl, box);
  }

  // Update a box by ID
  updateBox(id: number, box: Box): Observable<Box> {
    return this.http.put<Box>(`${this.apiUrl}/${id}`, box);
  }

  // Delete a box by ID
  deleteBox(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
