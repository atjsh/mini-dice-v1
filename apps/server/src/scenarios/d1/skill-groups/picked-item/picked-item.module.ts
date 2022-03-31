import { Module } from '@nestjs/common';
import { PickedItemService } from './picked-item.service';
import { PickedItemSkillGroup } from './picked-item.skillgroup';

@Module({
  providers: [PickedItemSkillGroup, PickedItemService],
})
export class PickedItemModule {}
