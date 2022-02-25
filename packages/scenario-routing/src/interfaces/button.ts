import { BlockData } from './block';

export interface ButtonData {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  label: string;
  type: string;
  url: string;
  code: string;
  linkedBlockId: number;
  buttonType: string;
  etc: null | string;
  operation: null | string;
  linkedBlock: null | BlockData;
}
