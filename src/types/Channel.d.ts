export type ChannelType = '';

export interface ChannelInterface {
  name: string;
  value?: number;
  type?: ChannelType;
  default?: number;
  min?: number;
  max?: number;
  amount?: number;
  steps?: number[];
}
