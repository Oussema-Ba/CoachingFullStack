import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";
import { Provider } from "../models/Provider";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  // URL de base de l’API pour les endpoints /providers
  private url = environment.apiUrl + 'providers';

  constructor(private http: HttpClient) {}

  // Récupérer tous les fournisseurs (GET /providers)
  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.url);
  }

  // Récupérer un fournisseur par ID
  getProviderById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.url}/${id}`);
  }

  // Supprimer un fournisseur
  deleteProvider(id: number): Observable<Provider> {
    return this.http.delete<Provider>(`${this.url}/${id}`);
  }

  // Créer un fournisseur AVEC logo
  createProviderWithLogo(providerData: Provider, file: File): Observable<Provider> {
    const formData = new FormData();
    formData.append('name', providerData.name);
    formData.append('address', providerData.address);
    formData.append('email', providerData.email);
    formData.append('telephone', providerData.telephone);
    formData.append('logoFile', file);

    return this.http.post<Provider>(`${this.url}/add`, formData);
  }

  // Mettre à jour un fournisseur + potentiel logo
  updateProviderWithLogo(providerId: number, providerData: Provider, file?: File): Observable<Provider> {
    const formData = new FormData();
    formData.append('name', providerData.name);
    formData.append('address', providerData.address);
    formData.append('email', providerData.email);
    formData.append('telephone', providerData.telephone);

    if (file) {
      formData.append('logoFile', file);
    }
    return this.http.put<Provider>(`${this.url}/${providerId}/edit`, formData);
  }

  // Récupérer le logo (blob)
  getProviderLogo(providerId: number): Observable<Blob> {
    return this.http.get(`${this.url}/${providerId}/logo`, { responseType: 'blob' });
  }

  // Récupérer la liste paginée
  getPaginatedProviders(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.url}/paginated?page=${page}&size=${size}`);
  }
}
