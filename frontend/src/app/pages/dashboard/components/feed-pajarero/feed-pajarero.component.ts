import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  IonList,
  IonIcon,
  IonFab,
  IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  ModalController,
} from '@ionic/angular';
import { SightingCardComponent } from './components/sighting-card/sighting-card.component';
import { CreateFeedPostComponent } from './components/create-feed-post/create-feed-post.component';
import { FeedStore } from '../../../../core/stores/feed.store';
import { addIcons } from 'ionicons';
import { camera, cameraOutline, telescopeOutline } from 'ionicons/icons';

/**
 * @sdd
 * - [Objetivo]: Vista principal del Feed Global.
 * - [I/O]: Usa FeedStore para inyectar datos e implementa IonInfiniteScroll y IonRefresher.
 * - [Edge Cases]: Evita recargas redundantes si ya existen posts en el store.
 */
@Component({
  selector: 'app-feed-pajarero',
  standalone: true,
  imports: [
    SightingCardComponent,
    IonList,
    IonIcon,
    IonFab,
    IonFabButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonRefresher,
    IonRefresherContent,
  ],
  templateUrl: './feed-pajarero.component.html',
  styleUrls: ['./feed-pajarero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedPajareroComponent implements OnInit {
  /**
   *
   */
  public readonly feedStore = inject(FeedStore);
  /**
   *
   */
  private readonly modalCtrl = inject(ModalController);

  /**
   *
   */
  constructor() {
    addIcons({ camera, cameraOutline, telescopeOutline });
  }

  /**
   *
   */
  ngOnInit() {
    if (this.feedStore.posts().length === 0) {
      this.feedStore.loadMorePosts();
    }
  }

  /**
   * Refresca el feed completo limpiando la lista y solicitando posts recientes.
   * @param event Evento disparado por IonRefresher.
   */
  handleRefresh(event: CustomEvent): void {
    this.feedStore.refreshFeed();
    setTimeout(() => {
      const target = event.target as unknown as {
        /**
         *
         */
        complete: () => void;
      };
      if (target?.complete) target.complete();
    }, 600);
  }

  /**
   *
   * @param event
   */
  onIonInfinite(event: CustomEvent) {
    this.feedStore.loadMorePosts();
    setTimeout(() => {
      const target = event.target as unknown as {
        /**
         *
         */
        complete: () => void;
      };
      if (target?.complete) target.complete();
    }, 500); // Mock delay for UX
  }

  /**
   *
   */
  async createNewSighting() {
    const modal = await this.modalCtrl.create({
      component: CreateFeedPostComponent,
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'publish') {
      this.feedStore.publishPost({
        content: data.content,
        image: data.image,
        location: data.location,
        needsIdentification: data.needsIdentification,
      });
    }
  }
}
