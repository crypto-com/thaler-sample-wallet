import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-txn-history",
  templateUrl: "./txn-history.component.html",
  styleUrls: ["./txn-history.component.scss"]
})
export class TxnHistoryComponent implements OnInit {
  constructor() {}
  settings = {
    pager: {
      perPage: 5
    },
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      tx_hash: {
        title: "TxHash"
      },
      block: {
        title: "Block",
        filter: false
      },
      age: {
        title: "Age",
        filter: false
      },
      action: {
        title: "",
        filter: {
          type: "list",
          config: {
            selectText: "Select...",
            list: [{ value: "IN", title: "IN" }, { value: "OUT", title: "OUT" }]
          }
        }
      },
      target: {
        title: "From/To"
      },
      value: {
        title: "Value",
        filter: false
      },
      tx_fee: {
        title: "TxFee",
        filter: false
      }
    }
  };
  data = [
    {
      tx_hash:
        "0x52d762946bc6f0defcbeb600f8ef02af40ea4a69b88997aba294598dd0b627c9",
      block: 1,
      age: 132,
      action: "OUT",
      target: "0x4fb2445742d0c413a917b2484960b0d80950b540",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x60f2057e6d82138cdc5d621241ff21835f392823ef91f58a2a076118f3b4483f",
      block: 2,
      age: 132,
      action: "OUT",
      target: "0x4fb2445742d0c413a917b2484960b0d80950b540",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 3,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 4,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 5,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 6,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 7,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 8,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 9,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 10,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 11,
      age: 132,
      action: "IN",
      target: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    }
  ];
  ngOnInit() {}
}
