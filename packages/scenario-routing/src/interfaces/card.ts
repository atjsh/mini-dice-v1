import { ButtonData } from './button';

export interface CardData {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  imageUrl: string;
  title: null | string;
  text: null | string;
  cardAndButtonLinks: CardAndButtonLinks[];
}

export interface CardAndButtonLinks {
  id: number;
  createdAt: string;
  updatedAt: string;
  scenarioId: null | string;
  cardId: number;
  buttonId: number;
  button: ButtonData;
}
