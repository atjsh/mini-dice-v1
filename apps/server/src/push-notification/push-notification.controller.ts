import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import type { UserIdType } from '@packages/shared-types';
import { JwtAuthGuard } from '../auth/local-jwt/jwt.guard';
import { UserJwt } from '../profile/decorators/user.decorator';
import { PushNotificationService } from './push-notification.service';

interface SubscribeRequestDto {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  expirationTime?: number;
}

interface UnsubscribeRequestDto {
  endpoint: string;
}

interface HeartbeatRequestDto {
  sessionId?: string;
}

@Controller('push')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Get('vapid-public-key')
  getVapidPublicKey(): { publicKey: string } {
    return {
      publicKey: this.pushNotificationService.getVapidPublicKey(),
    };
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @UserJwt('userId') userId: UserIdType,
    @Body() body: SubscribeRequestDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.subscribe({
      userId,
      endpoint: body.endpoint,
      p256dhKey: body.keys?.p256dh,
      authKey: body.keys?.auth,
      expirationTime: body.expirationTime,
    });

    return { success: true };
  }

  @Delete('unsubscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(
    @UserJwt('userId') userId: UserIdType,
    @Body() body: UnsubscribeRequestDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.unsubscribe(userId, body.endpoint);
    return { success: true };
  }

  @Delete('unsubscribe-all')
  @UseGuards(JwtAuthGuard)
  async unsubscribeAll(
    @UserJwt('userId') userId: UserIdType,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.unsubscribeAll(userId);
    return { success: true };
  }

  @Post('heartbeat')
  @UseGuards(JwtAuthGuard)
  async heartbeat(
    @UserJwt('userId') userId: UserIdType,
    @Body() body: HeartbeatRequestDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.updateHeartbeat(
      userId,
      body.sessionId,
    );
    return { success: true };
  }
}
