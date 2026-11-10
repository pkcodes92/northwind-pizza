import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";

import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CartService } from "../../services";

@Component({
  imports: [
    RouterLink,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  selector: "app-header",
  styleUrl: "./header.css",
  templateUrl: "./header.html",
})
export class Header {
  @Input() drawerOpened = false;
  @Output() menuToggle = new EventEmitter<void>();

  readonly cartService = inject(CartService);

  get menuLabel(): string {
    return this.drawerOpened ? "Close navigation menu" : "Open navigation menu";
  }

  get cartLabel(): string {
    const count = this.cartService.itemCount();
    return `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`;
  }
}
