# Web Push Notifications Setup Guide

This guide explains how to set up and use the Web Push Notifications feature for Mini Dice.

## Prerequisites

1. **VAPID Keys**: Generate VAPID keys for web push authentication
2. **Environment Variables**: Configure the server with VAPID keys
3. **Database Migration**: Create the required database tables
4. **HTTPS**: Push notifications require HTTPS in production

## Step 1: Generate VAPID Keys

VAPID keys are required for web push authentication. Generate them using the `web-push` CLI:

```bash
# Install web-push globally (if not already installed)
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys

# Output will look like:
# =======================================
# Public Key:
# BKxxx...xxx
#
# Private Key:
# abc123...xyz
# =======================================
```

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env` file:

```bash
# VAPID Configuration
VAPID_SUBJECT=mailto:lifegame2021team@gmail.com
VAPID_PUBLIC_KEY=<your-public-key-from-step-1>
VAPID_PRIVATE_KEY=<your-private-key-from-step-1>
```

**Note**: The `VAPID_SUBJECT` should be a `mailto:` URL or your website URL.

## Step 3: Database Migration

Create the required database tables by running a migration. The entities are already configured in TypeORM:

### Tables Created:

1. **`tb_push_subscriptions`**
   - Stores push notification subscriptions
   - Tracks subscription type (declarative vs service-worker)
   - Stores endpoint and encryption keys

2. **`tb_user_online_sessions`**
   - Tracks user online status via heartbeat
   - Used to skip push notifications for online users

3. **`tb_user_preference`** (updated)
   - Added `pushNotificationsEnabled` field

### SQL Migration Example:

```sql
-- Create push subscriptions table
CREATE TABLE tb_push_subscriptions (
  id UUID PRIMARY KEY,
  "userId" UUID NOT NULL,
  endpoint TEXT NOT NULL,
  "pushType" VARCHAR(50) NOT NULL,
  "p256dhKey" TEXT,
  "authKey" TEXT,
  "userAgent" TEXT,
  "expirationTime" TIMESTAMP,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  FOREIGN KEY ("userId") REFERENCES tb_user(id) ON DELETE CASCADE
);

-- Create user online sessions table
CREATE TABLE tb_user_online_sessions (
  "userId" UUID PRIMARY KEY,
  "lastHeartbeat" TIMESTAMP NOT NULL,
  "sessionId" VARCHAR(255),
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  FOREIGN KEY ("userId") REFERENCES tb_user(id) ON DELETE CASCADE
);

-- Add pushNotificationsEnabled to user preferences
ALTER TABLE tb_user_preference
ADD COLUMN "pushNotificationsEnabled" BOOLEAN DEFAULT false NOT NULL;

-- Create indexes for performance
CREATE INDEX idx_push_subscriptions_user_active ON tb_push_subscriptions("userId", "isActive");
CREATE INDEX idx_user_online_sessions_heartbeat ON tb_user_online_sessions("lastHeartbeat");
```

## Step 4: Usage

### Client-Side Usage

Users can enable push notifications from the settings page:

1. Navigate to `/preferences`
2. Toggle the "푸시 알림" (Push Notifications) switch
3. Grant notification permission when prompted
4. The system will automatically subscribe to push notifications

### Programmatic Usage

```typescript
import { usePushNotifications } from '@/libs/push-notification';

function MyComponent() {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    error,
  } = usePushNotifications();

  const handleSubscribe = async () => {
    try {
      await subscribe();
      console.log('Subscribed to push notifications');
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  return (
    <button onClick={handleSubscribe} disabled={!isSupported || isSubscribed}>
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
}
```

### Server-Side Usage

Push notifications are automatically triggered when new user activities (land events) are created:

```typescript
// In UserActivityService
await this.userActivityService.create({
  userId: 'user-id',
  skillRoute: '/d1/land1',
  skillDrawProps: { /* ... */ },
});
// Push notification is sent automatically if user is offline
```

To manually send a push notification:

```typescript
await this.pushNotificationService.sendNotificationToUser(userId, {
  title: 'Mini Dice - 새로운 알림',
  body: '새로운 이벤트가 발생했습니다!',
  navigateUrl: '/notification-center',
});
```

## Features

### Declarative Web Push (Primary)
- Supported in Safari 18.4+ on iOS/iPadOS/Mac
- Uses `web_push: "8030"` JSON format
- Automatically handled by the browser

### Service Worker Push (Fallback)
- Supported in Chrome, Firefox, Edge, and other browsers
- Traditional VAPID-based push subscription
- Handled by the service worker

### Smart Delivery Logic
- **Online Detection**: Push notifications are only sent to offline users
- **Heartbeat System**: Tracks user online status with 60-second heartbeat intervals
- **Offline Threshold**: Users are considered offline after 2 minutes of no heartbeat

### Automatic Subscription Management
- Subscriptions are automatically deactivated on error (410/404 responses)
- Users can unsubscribe at any time from settings
- Multiple device subscriptions are supported

## Testing

### Local Testing (Development)

1. Use `ngrok` or similar to expose your local server via HTTPS:
   ```bash
   ngrok http 3000
   ```

2. Update `VITE_SERVER_URL` to the ngrok HTTPS URL

3. Test push notifications:
   - Enable notifications in settings
   - Keep the app open (should NOT receive push)
   - Close the app or tab
   - Wait 2+ minutes
   - Create a land event
   - Should receive push notification

### Browser Support Testing

Test on different browsers to verify fallback behavior:
- **Safari 18.4+**: Should use declarative push
- **Chrome/Firefox/Edge**: Should use service worker push

## Troubleshooting

### Push notifications not received

1. Check notification permission: `Notification.permission` should be `"granted"`
2. Check service worker registration: Open DevTools → Application → Service Workers
3. Check heartbeat: User should be marked offline (no heartbeat for 2+ minutes)
4. Check server logs for push notification errors
5. Verify VAPID keys are correctly configured

### Service worker not registering

1. Ensure `/sw-push.js` is accessible at the root
2. Check browser console for registration errors
3. Verify HTTPS is enabled (required for service workers)

### Subscription fails

1. Check VAPID public key is correct
2. Ensure browser supports push notifications
3. Check for any CORS issues
4. Verify server endpoint is accessible

## Security Considerations

1. **VAPID Keys**: Keep private key secret, never expose in client code
2. **HTTPS**: Always use HTTPS in production
3. **User Consent**: Always request permission before subscribing
4. **Data Privacy**: Subscription data contains endpoint URLs - handle securely

## API Endpoints

- `GET /push/vapid-public-key` - Get VAPID public key
- `POST /push/subscribe` - Subscribe to push notifications (auth required)
- `DELETE /push/unsubscribe` - Unsubscribe from push notifications (auth required)
- `DELETE /push/unsubscribe-all` - Unsubscribe all user subscriptions (auth required)
- `POST /push/heartbeat` - Update online status (auth required)

## References

- [Web Push API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Declarative Web Push (WebKit Blog)](https://webkit.org/blog/16535/meet-declarative-web-push/)
- [web-push Library](https://github.com/web-push-libs/web-push)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
