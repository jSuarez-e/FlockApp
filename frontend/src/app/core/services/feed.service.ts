/**
 * @sdd
 * - [Objetivo]: Servicio de Angular para manejar las peticiones HTTP del Feed.
 * - [I/O]: Expone métodos asíncronos que devuelven Observables de FeedPost.
 * - [Edge Cases]: Se inyecta en el FeedStore cumpliendo el Single Responsibility Principle.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedPost, FeedReply } from '../../../../../shared/models/feed.model'; // fix: _FeedPost → FeedPost
import { environment } from '../../../environments/environment';

/** Respuesta cruda del backend al publicar: el post con coordenadas planas (lat/lng) en lugar de `location`. */
export interface PublishedPostResponse extends Omit<FeedPost, 'location'> {
  /** Latitud publicada, o null si el usuario denegó el GPS. */
  lat: number | null;
  /** Longitud publicada, o null si el usuario denegó el GPS. */
  lng: number | null;
}

/**
 *
 */
@Injectable({ providedIn: 'root' })
/**
 * Elemento documentado.
 */
export class FeedService {
  /**
   * Elemento documentado.
   */
  private http = inject(HttpClient);

  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   * @param cursor
   */
  getFeed(cursor: string | null): Observable<{ /**
   *
   */
  posts: PublishedPostResponse[]; /**
   *
   */
  nextCursor: string | null }> {
    const url = cursor
      ? `${environment.apiUrl}/feed?cursor=${cursor}`
      : `${environment.apiUrl}/feed`;
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    return this.http.get<{ /**
     *
     */
    posts: PublishedPostResponse[]; /**
     *
     */
    nextCursor: string | null }>(url);
  }

  /**
   * Elemento documentado.
   * @param formData
   */
  publishPost(formData: FormData): Observable<PublishedPostResponse> {
    return this.http.post<PublishedPostResponse>(`${environment.apiUrl}/feed/publish`, formData);
  }

  /**
   * Elemento documentado.
   * @param postId
   */
  toggleFavorite(postId: string): Observable<{ isFavorited: boolean }> {
    return this.http.post<{ isFavorited: boolean }>(`${environment.apiUrl}/feed/${postId}/favorite`, {});
  }

  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   * @param postId
   * @param content
   */
  addReply(postId: string, content: string): Observable<{ /**
   *
   */
  id: string; /**
   *
   */
  content: string }> {
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    return this.http.post<{ /**
     *
     */
    id: string; /**
     *
     */
    content: string }>(
      `${environment.apiUrl}/feed/${postId}/reply`,
      { content },
    );
  }

  /**
   * Elemento documentado.
   * @param postId
   */
  getReplies(postId: string): Observable<FeedReply[]> {
    return this.http.get<FeedReply[]>(`${environment.apiUrl}/feed/${postId}/replies`);
  }
}
