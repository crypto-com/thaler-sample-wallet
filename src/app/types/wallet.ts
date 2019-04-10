import BigNumber from "bignumber.js";

export interface Wallet {
  id: string;
  balance: BigNumber;
  addresses: string[];
}
