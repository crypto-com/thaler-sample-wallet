import BigNumber from "bignumber.js";

export interface Transaction {
  txHash: string;
  blockHeight: number;
  age: string;
  action: string;
  affectedAddress: string;
  value: string;
  txFee: number;
}

export interface TransactionFromRpc {
  address: string;
  amount: string;
  kind: string;
  block_height: number;
  block_time: string;
  transaction_id: string;
}
