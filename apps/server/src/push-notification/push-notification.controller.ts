import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
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

interface CurrentSubscriptionStatusRequestDto {
  endpoint?: string;
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
    @UserJwt() userJwt: UserJwtDto,
    @Body() body: SubscribeRequestDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.subscribe({
      userId: userJwt.userId,
      endpoint: body.endpoint,
      p256dhKey: body.keys?.p256dh,
      authKey: body.keys?.auth,
      expirationTime: body.expirationTime,
    });

    return { success: true };
  }

  @Post('current-subscription-status')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getCurrentSubscriptionStatus(
    @UserJwt() userJwt: UserJwtDto,
    @Body() body?: CurrentSubscriptionStatusRequestDto,
  ): Promise<{ subscribed: boolean }> {
    if (!body?.endpoint) {
      return { subscribed: false };
    }

    return {
      subscribed:
        await this.pushNotificationService.isCurrentSubscriptionActive(
          userJwt.userId,
          body.endpoint,
        ),
    };
  }

  @Delete('unsubscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(
    @UserJwt() userJwt: UserJwtDto,
    @Body() body: UnsubscribeRequestDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.unsubscribe(
      userJwt.userId,
      body.endpoint,
    );
    return { success: true };
  }

  @Delete('unsubscribe-all')
  @UseGuards(JwtAuthGuard)
  async unsubscribeAll(
    @UserJwt() userJwt: UserJwtDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.unsubscribeAll(userJwt.userId);
    return { success: true };
  }

  @Post('heartbeat')
  @UseGuards(JwtAuthGuard)
  async heartbeat(
    @UserJwt() userJwt: UserJwtDto,
    @Body() body: HeartbeatRequestDto,
  ): Promise<{ success: boolean }> {
    await this.pushNotificationService.updateHeartbeat(
      userJwt.userId,
      body.sessionId,
    );
    return { success: true };
  }
}
