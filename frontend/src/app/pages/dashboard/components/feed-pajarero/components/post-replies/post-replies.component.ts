import { Component, ChangeDetectionStrategy, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
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
  templateUrl: './post-replies.component.html',
  styleUrl: './post-replies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostRepliesComponent implements OnInit {
  /**
   * Post to which replies belong.
   */
  @Input() post!: FeedPost;

  /**
   * Icons used in the template.
   */
  readonly icons = {
    closeOutline,
    sendOutline,
    chatbubblesOutline,
  };


  /**
   * Controller for managing modal dismissal.
   */
  private modalCtrl = inject(ModalController);

  /**
   * Feed service for interacting with post comments.
   */
  private feedService = inject(FeedService);

  /**
   * Global feed reactive store.
   */
  private feedStore = inject(FeedStore);

  /**
   * List of replies for the current post.
   */
  replies = signal<FeedReply[]>([]);

  /**
   * Loading state while fetching replies.
   */
  isLoading = signal<boolean>(true);

  /**
   * Indicates whether a reply is currently being sent.
   */
  isSending = signal<boolean>(false);

  /**
   * Draft content of the new reply input.
   */
  newReplyContent = '';

  /**
   * Lifecycle hook to trigger loading of replies.
   */
  ngOnInit() {
    this.loadReplies();
  }

  /**
   * Loads replies for the current post.
   */
  async loadReplies(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.feedService.getReplies(this.post.id));
      this.replies.set(data);
    } catch (err) {
      logger.error('Error fetching replies', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Sends a new reply and updates the feed store.
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
   * Closes the reply modal.
   */
  close() {
    this.modalCtrl.dismiss();
  }
}
