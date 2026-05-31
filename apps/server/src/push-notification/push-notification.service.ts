import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { UserIdType } from '@packages/shared-types';
import * as webpush from 'web-push';
import { Repository } from 'typeorm';
import { ENV_KEYS } from '../config/enviorment-variable-config';
import { PushSubscriptionEntity } from './entities/push-subscription.entity';
import { UserOnlineSessionEntity } from './entities/user-online-session.entity';

interface SubscribeInputDto {
  userId: UserIdType;
  endpoint: string;
  p256dhKey?: string;
  authKey?: string;
  expirationTime?: number;
}

interface NotificationPayload {
  title: string;
  body: string;
  navigate: string;
}

// Constants
const DECLARATIVE_PUSH_VERSION = 8030; // Integer as per spec
const USER_ONLINE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes

@Injectable()
export class PushNotificationService {
  constructor(
    @InjectRepository(PushSubscriptionEntity)
    private pushSubscriptionRepository: Repository<PushSubscriptionEntity>,
    @InjectRepository(UserOnlineSessionEntity)
    private userOnlineSessionRepository: Repository<UserOnlineSessionEntity>,
    private configService: ConfigService,
  ) {
    // Initialize web-push with VAPID keys
    webpush.setVapidDetails(
      this.configService.getOrThrow(ENV_KEYS.VAPID_SUBJECT),
      this.configService.getOrThrow(ENV_KEYS.VAPID_PUBLIC_KEY),
      this.configService.getOrThrow(ENV_KEYS.VAPID_PRIVATE_KEY),
    );
  }

  getVapidPublicKey(): string {
    return this.configService.getOrThrow(ENV_KEYS.VAPID_PUBLIC_KEY);
  }

  async subscribe(input: SubscribeInputDto): Promise<PushSubscriptionEntity> {
    // A browser push endpoint can only represent one active account session.
    // Re-subscribing transfers ownership of this device/browser to the current user.
    await this.pushSubscriptionRepository.update(
      {
        endpoint: input.endpoint,
      },
      {
        isActive: false,
      },
    );

    // Create new subscription
    const subscription = this.pushSubscriptionRepository.create({
      userId: input.userId,
      endpoint: input.endpoint,
      p256dhKey: input.p256dhKey || null,
      authKey: input.authKey || null,
      expirationTime: input.expirationTime
        ? new Date(input.expirationTime)
        : null,
      isActive: true,
    });

    return await this.pushSubscriptionRepository.save(subscription);
  }

  async isCurrentSubscriptionActive(
    userId: UserIdType,
    endpoint: string,
  ): Promise<boolean> {
    const activeCount = await this.pushSubscriptionRepository.count({
      where: {
        userId,
        endpoint,
        isActive: true,
      },
    });

    return activeCount > 0;
  }

  async unsubscribe(userId: UserIdType, endpoint: string): Promise<void> {
    await this.pushSubscriptionRepository.update(
      {
        userId,
        endpoint,
      },
      {
        isActive: false,
      },
    );
  }

  async unsubscribeAll(userId: UserIdType): Promise<void> {
    await this.pushSubscriptionRepository.update(
      {
        userId,
      },
      {
        isActive: false,
      },
    );
  }

  async updateHeartbeat(
    userId: UserIdType,
    sessionId?: string,
  ): Promise<void> {
    const existing = await this.userOnlineSessionRepository.findOne({
      where: { userId },
    });

    if (existing) {
      existing.lastHeartbeat = new Date();
      if (sessionId) {
        existing.sessionId = sessionId;
      }
      await this.userOnlineSessionRepository.save(existing);
    } else {
      const session = this.userOnlineSessionRepository.create({
        userId,
        lastHeartbeat: new Date(),
        sessionId: sessionId || null,
      });
      await this.userOnlineSessionRepository.save(session);
    }
  }

  async isUserOnline(userId: UserIdType): Promise<boolean> {
    const session = await this.userOnlineSessionRepository.findOne({
      where: { userId },
    });

    if (!session) {
      return false;
    }

    // User is online if heartbeat received within the threshold
    const thresholdDate = new Date(Date.now() - USER_ONLINE_THRESHOLD_MS);
    return session.lastHeartbeat > thresholdDate;
  }

  async sendNotificationToUser(
    userId: UserIdType,
    notification: NotificationPayload,
  ): Promise<void> {
    // Check if user is online
    const isOnline = await this.isUserOnline(userId);
    if (isOnline) {
      // Skip push if user is online
      return;
    }

    // Get all active subscriptions for this user
    const subscriptions = await this.pushSubscriptionRepository.find({
      where: {
        userId,
        isActive: true,
      },
    });

    // Send push to all subscriptions with unified payload format
    await Promise.allSettled(
      subscriptions.map((subscription) =>
        this.sendPushNotification(subscription, notification),
      ),
    );
  }

  /**
   * Send push notification with unified payload format.
   * Uses Declarative Web Push spec (RFC 8030) which is compatible with all browsers.
   * Browsers that support declarative push will display the notification automatically.
   * Browsers that don't support it will receive the push event in the service worker.
   */
  private async sendPushNotification(
    subscription: PushSubscriptionEntity,
    notification: NotificationPayload,
  ): Promise<void> {
    // Use Declarative Web Push format as per spec
    // https://pr-preview.s3.amazonaws.com/w3c/push-api/pull/385.html
    const payload = JSON.stringify({
      web_push: DECLARATIVE_PUSH_VERSION, // Integer 8030 as per spec
      notification: {
        title: notification.title,
        body: notification.body,
        navigate: notification.navigate, // 'navigate' not 'navigate_url'
      },
    });

    if (!subscription.p256dhKey || !subscription.authKey) {
      console.error('Missing encryption keys for push subscription');
      return;
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dhKey,
            auth: subscription.authKey,
          },
        },
        payload,
      );
    } catch (error) {
      console.error('Failed to send push notification:', error);
      // Deactivate subscription on error
      if (
        error instanceof Error &&
        (error.message.includes('410') || error.message.includes('404'))
      ) {
        await this.pushSubscriptionRepository.update(
          { id: subscription.id },
          { isActive: false },
        );
      }
    }
  }
}
