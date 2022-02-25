import { BlockData } from './block';
import { ContentData } from './content';
import { BlockAndQuickReplyLink } from './quickReply';

export interface BlockTreeData extends BlockData {
  blockAndContentLinks: BlockAndContentLinks[];
  blockAndQuickReplyLinks: BlockAndQuickReplyLink[];
}

export interface BlockAndContentLinks {
  id: number;
  createdAt: string;
  updatedAt: string;
  blockId: number;
  contentId: number;
  scenarioId: number;
  name: string;
  depth: number;
  condition_1: string;
  condition_2: string;
  condition_3: string;
  content: ContentData;
}
