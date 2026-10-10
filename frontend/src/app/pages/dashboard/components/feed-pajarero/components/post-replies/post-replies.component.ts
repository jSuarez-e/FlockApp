import { Component, ChangeDetectionStrategy, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonFooter,
  IonTextarea,
  IonSpinner,
} from '@ionic/angular';
import { closeOutline, sendOutline, chatbubblesOutline } from 'ionicons/icons';
import { FeedPost, FeedReply } from '../../../../../../../../../shared/models/feed.model';
import { FeedService } from '../../../../../../core/services/feed.service';
import { FeedStore } from '../../../../../../core/stores/feed.store';
import { logger } from '../../../../../../core/utils/logger';

/**
 *
 */
@Component({
  selector: 'app-post-replies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonAvatar,
    IonFooter,
    IonTextarea,
    IonSpinner,
  ],
  template: `
    <ion-header class="ion-no-border flock-modal-header">
      <ion-toolbar>
        <ion-title>Respuestas</ion-title>
        <ion-buttons slot="end">
          <button type="button" (click)="close()" class="flock-header-pill-btn" aria-label="Cerrar modal">
            <ion-icon [icon]="icons.closeOutline"></ion-icon>
            <span>Cerrar</span>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      @if (isLoading()) {
        <div class="center-content">
          <ion-spinner name="crescent"></ion-spinner>
        </div>
      } @else if (replies().length === 0) {
        <div class="empty-state">
          <ion-icon [icon]="icons.chatbubblesOutline"></ion-icon>
          <h3>Aún no hay respuestas</h3>
          <p>Sé el primero en iniciar la conversación sobre este avistamiento.</p>
        </div>
      } @else {
        <div class="replies-list">
          @for (reply of replies(); track reply.id) {
            <ion-item lines="none" class="reply-item">
              <ion-avatar slot="start" class="reply-avatar">
                <img
                  [src]="
                    reply.authorAvatarUrl ||
                    'https://ui-avatars.com/api/?name=' +
                      reply.authorName +
                      '&background=random&color=fff'
                  "
                />
              </ion-avatar>
              <ion-label class="ion-text-wrap">
                <div class="reply-header">
                  <span class="author-name">{{ reply.authorName }}</span>
                  <span class="reply-date">{{ reply.createdAt | date: 'short' }}</span>
                </div>
                <p class="reply-content">{{ reply.content }}</p>
              </ion-label>
            </ion-item>
          }
        </div>
      }
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar class="ion-padding-horizontal chat-toolbar">
        <ion-avatar slot="start" class="chat-avatar">
          <img src="https://ui-avatars.com/api/?name=Yo&background=random" />
        </ion-avatar>
        <ion-textarea
          placeholder="Añadir una respuesta..."
          [autoGrow]="true"
          rows="1"
          class="chat-input"
          [(ngModel)]="newReplyContent"
        ></ion-textarea>
        <ion-button
          slot="end"
          fill="clear"
          color="primary"
          class="send-btn"
          [disabled]="!newReplyContent.trim() || isSending()"
          (click)="sendReply()"
        >
          <ion-icon [icon]="icons.sendOutline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      .center-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      .empty-state {
        text-align: center;
        margin-top: 60px;
        color: var(--ion-color-medium);
      }
      .empty-state ion-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .replies-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .reply-item {
        --padding-start: 0;
        --inner-padding-end: 0;
        align-items: flex-start;
      }
      .reply-avatar {
        width: 32px;
        height: 32px;
        margin-right: 12px;
        margin-top: 4px;
      }
      .reply-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      .author-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--ion-color-dark);
      }
      .reply-date {
        font-size: 12px;
        color: var(--ion-color-medium);
      }
      .reply-content {
        font-size: 14px;
        color: var(--ion-text-color, #333);
        margin: 0;
        line-height: 1.4;
      }
      :host-context(body.dark) .reply-content {
        color: #e2e8f0;
      }
      :host-context(body.dark) .author-name {
        color: #f8fafc;
      }

      .chat-toolbar {
        padding-top: 8px;
        padding-bottom: 12px;
        display: flex;
        align-items: flex-end;
      }
      .chat-avatar {
        width: 36px;
        height: 36px;
        margin-right: 12px;
        margin-bottom: 4px;
      }
      .chat-input {
        --background: #f1f5f9;
        --padding-start: 16px;
        --padding-end: 16px;
        --padding-top: 12px;
        --padding-bottom: 12px;
        --border-radius: 20px;
        font-size: 15px;
        margin: 0;
      }
      :host-context(body.dark) .chat-input {
        --background: #1e293b;
      }
      .send-btn {
        margin-bottom: 4px;
        margin-left: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostRepliesComponent implements OnInit {
  /**
   *
   */
  @Input() post!: FeedPost;

  /**
   *
   */
  readonly icons = {
    closeOutline,
    sendOutline,
    chatbubblesOutline,
  };

  /**
   *
   */
  private destroyRef = inject(DestroyRef);
  private modalCtrl = inject(ModalController);
  /**
   *
   */
  private feedService = inject(FeedService);
  /**
   *
   */
  private feedStore = inject(FeedStore);

  /**
   *
   */
  replies = signal<FeedReply[]>([]);
  /**
   *
   */
  isLoading = signal<boolean>(true);
  /**
   *
   */
  isSending = signal<boolean>(false);
  /**
   *
   */
  newReplyContent = '';

  /**
   *
   */
  ngOnInit() {
    this.loadReplies();
  }

  /**
   *
   */
  loadReplies() {
    this.isLoading.set(true);
    this.feedService
      .getReplies(this.post.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      /**
       *
       * @param data
       */
      next: (data) => {
        this.replies.set(data);
        this.isLoading.set(false);
      },
      /**
       *
       * @param err
       */
      error: (err) => {
        logger.error('Error fetching replies', err);
        this.isLoading.set(false);
      },
    });
  }

  /**
   *
   */
  sendReply() {
    if (!this.newReplyContent.trim()) return;

    this.isSending.set(true);
    const content = this.newReplyContent.trim();

    // Call the global store to increment count
    this.feedStore.addReply({ postId: this.post.id, content });

    // We can optimistically push it locally to the replies array
    const optimisticReply: FeedReply = {
      id: Date.now().toString(),
      postId: this.post.id,
      authorId: 'me',
      authorName: 'Yo',
      content: content,
      createdAt: new Date().toISOString(),
    };

    this.replies.update((r) => [...r, optimisticReply]);
    this.newReplyContent = '';
    this.isSending.set(false);
  }

  /**
   *
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
