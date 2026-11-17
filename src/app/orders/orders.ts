import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  imports: [],
  selector: "app-orders",
  styleUrls: ["./orders.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./orders.html",
})
export class Orders {}
