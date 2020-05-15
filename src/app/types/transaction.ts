export interface Transaction {
  txHash: string;
  blockHeight: number;
  age: string;
  action: string;
  affectedAddress: string;
  txType: string;
  value: string;
}

export interface TransactionFromRpc {
  address: string;
  amount: string;
  kind: string;
  block_height: number;
  block_time: string;
  transaction_id: string;
}
