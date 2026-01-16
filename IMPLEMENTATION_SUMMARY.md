# Web Push Notifications Implementation Summary

## Overview
This PR implements Web Push & Web Notifications API support using the Declarative Web Push specification (RFC 8030). The implementation uses a unified payload format that works with all browsers, with automatic handling by Safari 18.4+ and service worker-based display for other browsers.

## Changes Made

### 1. Database Layer (2 new tables + 1 updated)
- **`tb_push_subscriptions`**: Stores push notification subscriptions
  - Stores endpoint and encryption keys only
  - No push type or user agent tracking (privacy-focused)
  - Auto-deactivates on delivery errors (410/404)

- **`tb_user_online_sessions`**: Tracks user online status
  - Uses heartbeat system (60-second intervals)
  - Enables smart push delivery (skip if user online)

- **`tb_user_preference`**: Updated with `pushNotificationsEnabled` field

### 2. Server-Side Implementation (NestJS)

**New Dependencies:**
- `web-push@^3.6.7` - VAPID-based push notification library
- `@types/web-push@^3.6.3` - TypeScript types

**Modules Created:**
- `PushNotificationModule` - Main module with service and controller
- `PushNotificationService` - Core push notification logic with unified payload
- `PushNotificationController` - REST API endpoints

**Key Features:**
- VAPID authentication for secure push delivery
- Smart delivery: Only sends to offline users (2-minute threshold)
- Unified Declarative Web Push format (RFC 8030)
- Automatic subscription error handling
- Integration with UserActivityService

**API Endpoints:**
- `GET /push/vapid-public-key` - Get VAPID public key
- `POST /push/subscribe` - Subscribe to notifications (auth required)
- `DELETE /push/unsubscribe` - Unsubscribe (auth required)
- `DELETE /push/unsubscribe-all` - Unsubscribe all devices (auth required)
- `POST /push/heartbeat` - Update online status (auth required)

### 3. Client-Side Implementation (React)

**Service Worker:**
- `public/sw-push.js` - Handles push events and notification clicks
- Detects RFC 8030 format and handles display appropriately
- Safari detection for automatic vs manual display
- Auto-focus or open notification center on click

**Libraries Created:**
- `push-notification-manager.ts` - Subscription management
  - Simplified unified subscription method
  - VAPID key conversion and subscription handling
  - No browser-specific detection needed

- `online-status-tracker.ts` - Online status tracking
  - 60-second heartbeat intervals
  - Visibility change detection
  - Session management

- `use-push-notifications.hook.ts` - React hook
  - Subscription state management
  - Permission handling
  - Error handling

**Components Created:**
- `PushNotificationSettings.component.tsx` - Settings UI
  - Toggle switch for enable/disable
  - Permission status display
  - Error messages with ARIA attributes
  - Loading states

**Pages Created:**
- `UserPreference.page.tsx` - Settings page at `/preferences`

**API Integration:**
- User preference API client functions
- React Query hooks for data fetching

### 4. Documentation

**`PUSH_NOTIFICATIONS_SETUP.md`:**
- Step-by-step setup guide
- VAPID key generation instructions
- Database migration SQL
- Environment variable configuration
- Usage examples
- Troubleshooting guide
- API reference

## Technical Highlights

### Smart Delivery Logic
```typescript
// Only send push if user is offline (no heartbeat for 2+ minutes)
const isOnline = await this.isUserOnline(userId);
if (isOnline) {
  return; // Skip push
}
```

### Unified Push Format (RFC 8030)
```json
{
  "web_push": 8030,
  "notification": {
    "title": "Mini Dice - 새로운 알림",
    "body": "새로운 이벤트가 발생했습니다!",
    "navigate": "/notification-center"
  }
}
```

**Key differences from previous implementation:**
- `web_push` is integer `8030`, not string `"8030"`
- Uses `navigate` field, not `navigate_url`
- Same format sent to all browsers
- Safari 18.4+ displays automatically
- Other browsers display via service worker

## Code Quality

✅ **TypeScript**: All code type-checks successfully
- Server: `yarn server:typecheck` ✓
- Web: `yarn g:tsc --noEmit` ✓

✅ **Code Review**: All feedback addressed
- Replaced deprecated `substr()` with `substring()`
- Extracted magic strings to constants
- Improved comments and documentation
- Added ARIA attributes for accessibility
- Enhanced browser detection logic

✅ **Error Handling**: Comprehensive error handling
- Push delivery errors (410/404) auto-deactivate subscriptions
- Graceful fallback from declarative to service worker push
- User-friendly error messages in UI

✅ **Security**: VAPID-based authentication
- Private keys stored server-side only
- HTTPS required for push notifications
- User consent required before subscription

## Testing Recommendations

1. **Setup**:
   - Generate VAPID keys: `web-push generate-vapid-keys`
   - Add to `.env`: `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
   - Run database migrations

2. **Test Subscription Flow**:
   - Navigate to `/preferences`
   - Toggle push notifications on
   - Grant permission when prompted
   - Verify subscription created in database

3. **Test Online Detection**:
   - Keep app open → should see heartbeats in database
   - Close app for 2+ minutes → should be marked offline
   - Create land event → should receive push notification

4. **Test Browser Support**:
   - Safari 18.4+ → verify declarative push used
   - Chrome/Firefox → verify service worker push used

5. **Test Notification Click**:
   - Receive push notification
   - Click notification → should navigate to `/notification-center`

## Deployment Checklist

- [ ] Generate and configure VAPID keys
- [ ] Run database migrations
- [ ] Verify HTTPS is enabled
- [ ] Test on staging environment
- [ ] Monitor push delivery success rates
- [ ] Set up error logging/monitoring

## Files Changed

- **29 files changed**: 3,409 insertions(+), 1,563 deletions(-)
- **New files**: 24
- **Modified files**: 5

## Migration from PR #70

This PR builds on PR #70 which added the UserPreference entity. The `pushNotificationsEnabled` field has been added to that entity to track user preferences for push notifications.

## References

- [Declarative Web Push (WebKit Blog)](https://webkit.org/blog/16535/meet-declarative-web-push/)
- [Web Push Protocol (RFC 8030)](https://datatracker.ietf.org/doc/html/rfc8030)
- [VAPID (RFC 8292)](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)

## Status

✅ **Implementation Complete**
✅ **Type Checks Passing**
✅ **Code Review Feedback Addressed**
✅ **Documentation Complete**
✅ **Ready for Testing**
