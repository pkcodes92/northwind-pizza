import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UnderDevelopment } from "../shared/under-development/under-development";

@Component({
  imports: [UnderDevelopment],
  selector: "app-admin",
  styleUrls: ["./admin.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./admin.html",
})
export class Admin {}
