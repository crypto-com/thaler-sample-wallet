import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-receive-fund",
  templateUrl: "./receive-fund.component.html",
  styleUrls: ["./receive-fund.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveFundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  copyMessage(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
}
