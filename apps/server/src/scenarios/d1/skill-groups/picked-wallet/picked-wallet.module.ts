import { Module } from '@nestjs/common';
import { PickedWalletService } from './picked-wallet.service';
import { PickedWalletSkillGroup } from './picked-wallet.skillgroup';

@Module({
  providers: [PickedWalletSkillGroup, PickedWalletService],
})
export class PickedWalletModule {}
