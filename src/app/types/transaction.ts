import BigNumber from "bignumber.js";

export interface Transaction {
  txHash: string;
  blockNumber?: number;
  type: TransactionType;
  from: string;
  to: string;
  amount: BigNumber;
  txFee: BigNumber;
}

export enum TransactionType {
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT",
}
