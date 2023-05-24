export interface ChannelInterface {
  name: string;
  value: number;
  type?: string;
  default?: number;
  min: number | void;
  max: number | void;
  amount?: number;
  steps?: number[];
}

export type ChannelValue = ChannelInterface['value'];
