import { CardData } from './card';

export interface ContentData {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  code: string;
  cardType: string;
  type: string;
  contentAndCardLinks: ContentAndCardLinks[];
}

export interface ContentAndCardLinks {
  id: number;
  createdAt: string;
  updatedAt: string;
  scenarioId: null | string;
  contentId: number;
  cardId: number;
  name: string;
  depth: number;
  card: CardData;
}
