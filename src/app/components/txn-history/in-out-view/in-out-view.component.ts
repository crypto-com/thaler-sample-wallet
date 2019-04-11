import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { isNil } from "lodash";

@Component({
  templateUrl: "./in-out-view.component.html",
  styleUrls: ["./in-out-view.component.scss"]
})
export class InOutViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;
  ngOnInit() {
    if (!isNil(this.value)) {
      this.renderValue = this.value.toString().toUpperCase();
    }
  }
}
