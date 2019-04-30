import BigNumber from "bignumber.js";

export interface Transaction {
  txHash: string;
  blockHeight: number;
  age: string;
  action: string;
  affectedAddress: string;
  value: number;
  txFee: number;
}

export interface TransactionFromRpc {
  address: {
    BasicRedeem: string;
  };
  balance_change: {
    Incoming?: number;
    Outgoing?: number;
  };
  height: number;
  time: string;
  transaction_id: number[];
}
