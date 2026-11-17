import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UnderDevelopment } from "../shared/under-development/under-development";

@Component({
  imports: [UnderDevelopment],
  selector: "app-orders",
  styleUrls: ["./orders.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./orders.html",
})
export class Orders {}
