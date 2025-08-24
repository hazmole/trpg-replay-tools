import { BaseCollection } from "./base-collection";


export class ChannelCollection extends BaseCollection<Channel> {
  constructor() { super() }
}

export interface Channel {
  id: string;
  name: string;
  isMain: boolean;
  isHidden: boolean;
};