/**
 * @sdd
 * - [Objetivo]: Store global para el Feed, gestionando paginación por cursor y modo offline.
 * - [I/O]: Consume HttpClient para API REST, expone estado reactivo para la UI.
 * - [Edge Cases]: Maneja la concatenación de posts al hacer scroll infinito.
 */
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { FeedPost } from '../../../../../shared/models/feed.model';
import { FeedService } from '../services/feed.service';
import { logger } from '../utils/logger';

/**
 * Elemento documentado.
 */
interface FeedState {
  /**
   * Elemento documentado.
   */
  posts: FeedPost[];
  /**
   * Elemento documentado.
   */
  cursor: string | null;
  /**
   * Elemento documentado.
   */
  isLoading: boolean;
  /**
   * Elemento documentado.
   */
  hasMore: boolean;
}

const initialState: FeedState = {
  posts: [],
  cursor: null,
  isLoading: false,
  hasMore: true,
};

export const FeedStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, feedService = inject(FeedService)) => ({
    // Método reactivo para cargar más posts
    loadMorePosts: rxMethod<void>(
      pipe(
        tap(() => {
          if (!store.isLoading()) {
            patchState(store, { isLoading: true });
          }
        }),
        switchMap(() => {
          return feedService.getFeed(store.cursor()).pipe(
            tap((response) => {
              const mappedPosts: FeedPost[] = response.posts.map((p) => ({
                ...p,
                location: p.lat != null && p.lng != null ? { lat: p.lat, lng: p.lng } : null,
              }));
              patchState(store, (state) => {
                const existingIds = new Set(state.posts.map((item) => item.id));
                const uniqueNewPosts = mappedPosts.filter((item) => !existingIds.has(item.id));
                return {
                  posts: [...state.posts, ...uniqueNewPosts],
                  cursor: response.nextCursor,
                  hasMore: !!response.nextCursor,
                  isLoading: false,
                };
              });
            }),
            catchError((err) => {
              logger.error('Error fetching feed', err);
              patchState(store, { isLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),

    /**
     * Resetea el feed por completo al cambiar de sesión o cuenta.
     */
    resetFeed() {
      patchState(store, { posts: [], cursor: null, hasMore: true, isLoading: false });
    },

    /**
     * Elemento documentado.
     */
    refreshFeed() {
      patchState(store, { posts: [], cursor: null, hasMore: true, isLoading: false });
      this.loadMorePosts();
    },

    /**
     * Elemento documentado.
     * @param post
     */
    addLocalDraft(post: FeedPost) {
      patchState(store, (state) => ({
        posts: [post, ...state.posts],
      }));
    },

    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    publishPost: rxMethod<{
      /**
       *
       */
      content: string;
      /**
       *
       */
      image?: string;
      /**
       *
       */
      location?: { /**
       *
       */
      lat: number; /**
       *
       */
      lng: number };
      /**
       *
       */
      needsIdentification?: boolean;
      /**
       *
       */
      routeId?: string;
    }>(
      pipe(
        switchMap((payload) => {
          const formData = new FormData();
          formData.append(
            'metadata',
            JSON.stringify({
              title: payload.needsIdentification
                ? 'Ayuda de Identificación'
                : 'Actualización en Comunidad',
              description: payload.content,
              lat: payload.location?.lat,
              lng: payload.location?.lng,
              needsIdentification: payload.needsIdentification,
              routeId: payload.routeId,
            }),
          );

          if (payload.image) {
            // Convert dataUrl to Blob
            const arr = payload.image.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            formData.append('image', blob, 'upload.jpg');
          }

          return feedService.publishPost(formData).pipe(
            tap((rawPost) => {
              const newPost: FeedPost = {
                ...rawPost,
                location:
                  rawPost.lat != null && rawPost.lng != null
                    ? { lat: rawPost.lat, lng: rawPost.lng }
                    : null,
              };
              patchState(store, (state) => ({
                posts: [newPost, ...state.posts],
              }));
            }),
            catchError((err) => {
              logger.error('Error publishing post', err);
              return of(null);
            }),
          );
        }),
      ),
    ),

    toggleFavorite: rxMethod<string>(
      pipe(
        switchMap((postId) => {
          return feedService.toggleFavorite(postId).pipe(
            tap((res) => {
              patchState(store, (state) => ({
                posts: state.posts.map((p) => {
                  if (p.id === postId) {
                    const increment = res.isFavorited ? 1 : -1;
                    return { ...p, savesCount: Math.max(0, p.savesCount + increment) };
                  }
                  return p;
                }),
              }));
            }),
            catchError((err) => {
              logger.error('Error toggling favorite', err);
              return of(null);
            }),
          );
        }),
      ),
    ),

    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    addReply: rxMethod<{ /**
     *
     */
    postId: string; /**
     *
     */
    content: string }>(
      pipe(
        switchMap(({ postId, content }) => {
          return feedService.addReply(postId, content).pipe(
            tap(() => {
              patchState(store, (state) => ({
                posts: state.posts.map((p) =>
                  p.id === postId ? { ...p, repliesCount: p.repliesCount + 1 } : p,
                ),
              }));
            }),
            catchError((err) => {
              logger.error('Error adding reply', err);
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
);
