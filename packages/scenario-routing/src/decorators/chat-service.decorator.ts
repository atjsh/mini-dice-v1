import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import {
  ChatServiceNameMetadataKey,
  ChatServiceChatResponseMethodMetadataKey,
} from '../constants';

import { ScenarioNameType } from '../scenario-route.interface';

export const ChatService = (scenarioName: ScenarioNameType) =>
  applyDecorators(
    SetMetadata(ChatServiceNameMetadataKey, scenarioName),
    Injectable(),
  );

export const ChatResponse = () =>
  SetMetadata(ChatServiceChatResponseMethodMetadataKey, true);
