import { Component } from "@angular/core";
import { UnderDevelopment } from "../shared/under-development/under-development";

@Component({
  imports: [UnderDevelopment],
  selector: "app-not-found",
  styleUrl: "./not-found.css",
  templateUrl: "./not-found.html",
})
export class NotFound {}
