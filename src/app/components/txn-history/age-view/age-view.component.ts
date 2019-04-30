import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "app-age-view",
  templateUrl: "./age-view.component.html",
  styleUrls: ["./age-view.component.scss"]
})
export class AgeViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;
  ngOnInit() {
    this.renderValue = this.value.toString();
  }
}
