import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-txn-history",
  template: `
    <ng2-smart-table
      [settings]="settings"
      [source]="data"
      class="table table-striped"
    ></ng2-smart-table>
  `,
  styleUrls: ["./txn-history.component.sass"]
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
        title: "Block"
      },
      age: {
        title: "Age"
      },
      from: {
        title: "From"
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
      to: {
        title: "To"
      },
      value: {
        title: "Value"
      },
      tx_fee: {
        title: "TxFee"
      }
    }
  };
  data = [
    {
      tx_hash:
        "0x52d762946bc6f0defcbeb600f8ef02af40ea4a69b88997aba294598dd0b627c9",
      block: 1,
      age: 132,
      from: "0x412177283576d69bc8fd9d05336830776ed3971b",
      action: "OUT",
      to: "0x4fb2445742d0c413a917b2484960b0d80950b540",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x60f2057e6d82138cdc5d621241ff21835f392823ef91f58a2a076118f3b4483f",
      block: 2,
      age: 132,
      from: "0x412177283576d69bc8fd9d05336830776ed3971b",
      action: "OUT",
      to: "0x4fb2445742d0c413a917b2484960b0d80950b540",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 3,
      age: 132,
      from: "0xb7c679a4d06465fa35d977716646a63957b3b2b5",
      action: "IN",
      to: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 4,
      age: 132,
      from: "0xb7c679a4d06465fa35d977716646a63957b3b2b5",
      action: "IN",
      to: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 5,
      age: 132,
      from: "0xb7c679a4d06465fa35d977716646a63957b3b2b5",
      action: "IN",
      to: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 6,
      age: 132,
      from: "0xb7c679a4d06465fa35d977716646a63957b3b2b5",
      action: "IN",
      to: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    },
    {
      tx_hash:
        "0x88022ca8a70ce32827a9476d2a50fb993050dacf79e632907684274368d26d57",
      block: 7,
      age: 132,
      from: "0xb7c679a4d06465fa35d977716646a63957b3b2b5",
      action: "IN",
      to: "0x412177283576d69bc8fd9d05336830776ed3971b",
      value: 123.123,
      tx_fee: 0.00001
    }
  ];
  ngOnInit() {}
}
