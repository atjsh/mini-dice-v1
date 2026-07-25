import { authedAxios } from '../tdol-server/auth/access-token';

const HEARTBEAT_INTERVAL = 60 * 1000; // 60 seconds

export class OnlineStatusTracker {
  private static instance: OnlineStatusTracker;
  private heartbeatInterval: number | null = null;
  private sessionId: string;
  private isTracking = false;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): OnlineStatusTracker {
    if (!OnlineStatusTracker.instance) {
      OnlineStatusTracker.instance = new OnlineStatusTracker();
    }
    return OnlineStatusTracker.instance;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Send heartbeat to server
   */
  private async sendHeartbeat(): Promise<void> {
    try {
      await authedAxios.post('/push/heartbeat', {
        sessionId: this.sessionId,
      });
    } catch (error) {
      console.error('Failed to send heartbeat:', error);
    }
  }

  /**
   * Start tracking online status
   */
  startTracking(): void {
    if (this.isTracking) {
      return;
    }

    this.isTracking = true;

    // Send initial heartbeat
    void this.sendHeartbeat();

    // Set up interval for periodic heartbeats
    this.heartbeatInterval = window.setInterval(() => {
      void this.sendHeartbeat();
    }, HEARTBEAT_INTERVAL);

    // Handle visibility changes
    this.setupVisibilityHandler();

    // Handle beforeunload
    this.setupBeforeUnloadHandler();
  }

  /**
   * Stop tracking online status
   */
  stopTracking(): void {
    if (!this.isTracking) {
      return;
    }

    this.isTracking = false;

    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Remove event listeners
    this.removeVisibilityHandler();
    this.removeBeforeUnloadHandler();
  }

  /**
   * Set up visibility change handler
   */
  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Remove visibility change handler
   */
  private removeVisibilityHandler(): void {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
  }

  /**
   * Handle visibility change
   */
  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      // Send heartbeat when tab becomes visible
      void this.sendHeartbeat();
    }
  };

  /**
   * Set up beforeunload handler
   */
  private setupBeforeUnloadHandler(): void {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Remove beforeunload handler
   */
  private removeBeforeUnloadHandler(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Handle beforeunload
   */
  private handleBeforeUnload = (): void => {
    // Note: We don't send a final heartbeat on unload
    // The server will consider the user offline after 2 minutes of no heartbeat
  };

  /**
   * Check if tracking is active
   */
  isTrackingActive(): boolean {
    return this.isTracking;
  }
}

export const onlineStatusTracker = OnlineStatusTracker.getInstance();
