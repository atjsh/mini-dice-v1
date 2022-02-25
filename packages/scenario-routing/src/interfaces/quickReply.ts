import { BlockData } from './block';

export interface BlockAndQuickReplyLink {
  blockId: number;
  condition_1: string;
  condition_2: string;
  condition_3: string;
  createdAt: string;
  updatedAt: string;
  depth: number;
  id: number;
  name: string;
  quickReply: QuickReplyData;
  quickReplyId: number;
  scenarioId: number;
}

export interface QuickReplyData {
  id: number;
  code: string;
  createdAt: string;
  updatedAt: string;
  label: string;
  linkType: null | string;
  linkedBlock: BlockData;
  linkedBlockId: number;
  makeType: null | string;
  message: string;
  name: string;
  type: string;
  url: string;
}
