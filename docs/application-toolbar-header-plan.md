# Application Toolbar Header Plan

> **Scope:** This is a plan only. No application code is changed by this document.

The current application shell in `src/app/app.html` already contains an Angular Material toolbar inside the sidenav content. This plan extracts that toolbar into a dedicated, semantic header component while keeping drawer ownership in the root shell. It also describes how to add a cart action and later connect its count to shared cart state.

## 1. 🧭 Keep shell and header responsibilities separate

Keep the sidenav container, drawer, viewport behavior, and routed page outlet in the root `App` component. The header should render the brand and action buttons, but it should not hold a direct reference to the sidenav. Communicate via inputs and outputs:

- The root passes the drawer's open state to the header.
- The header emits a menu-toggle request.
- The root toggles the drawer; `openedChange` remains the source of truth for updating the open state.

This keeps the header reusable and avoids coupling it to a particular shell implementation.

## 2. 🧩 Create a standalone header component

Add a folder such as `src/app/header/` with `header.ts`, `header.html`, and `header.css`. For a property-based lecture example, use the familiar `@Input` and `@Output` decorators with `EventEmitter`. Computed display strings can be ordinary getters:

```ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: "app-header",
  imports: [RouterLink, MatButtonModule, MatIconModule, MatToolbarModule],
  styleUrl: "./header.css",
  templateUrl: "./header.html",
})
export class Header {
  @Input() drawerOpened = false;
  @Input() cartItemCount = 0;
  @Output() menuToggle = new EventEmitter<void>();

  get menuLabel(): string {
    return this.drawerOpened ? "Close navigation menu" : "Open navigation menu";
  }

  get cartLabel(): string {
    const count = this.cartItemCount;
    return `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`;
  }
}
```

The parent remains responsible for the drawer state; the header receives values through input properties and reports user intent through an output event.

## 3. 🏷️ Make the toolbar a semantic header

Put the Material toolbar inside a native `<header>` in `header.html`. Use a button for the sidenav action and a router link for the cart destination. Keep the item count visible, and include it in the cart link's accessible name; mark the duplicate visual count as hidden from assistive technology.

```html
<header class="app-header">
  <mat-toolbar>
    <button
      mat-icon-button
      type="button"
      [attr.aria-label]="menuLabel"
      [attr.aria-expanded]="drawerOpened"
      aria-controls="main-navigation"
      (click)="menuToggle.emit()"
    >
      <mat-icon>{{ drawerOpened ? "close" : "menu" }}</mat-icon>
    </button>

    <a class="brand" routerLink="/home">Northwind Pizza</a>

    <a
      class="cart-action"
      mat-icon-button
      routerLink="/cart"
      [attr.aria-label]="cartLabel"
    >
      <mat-icon>shopping_cart</mat-icon>
      <span class="cart-count" aria-hidden="true">{{ cartItemCount }}</span>
    </a>
  </mat-toolbar>
</header>
```

The `<header>` element creates the semantic banner landmark. Keep the menu button's `aria-controls` value aligned with the drawer's `id` in the root template. Add concise responsive styles in `header.css`; for example, use flexible spacing to keep the brand and cart action aligned:

```css
.app-header mat-toolbar {
  display: flex;
  gap: 0.5rem;
}

.brand {
  color: inherit;
  text-decoration: none;
}

.cart-action {
  position: relative;
  margin-inline-start: auto;
}

.cart-count {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  min-width: 1rem;
  border-radius: 999px;
  font-size: 0.7rem;
  line-height: 1rem;
  text-align: center;
}
```

Style the count badge to match the application's Material theme, and check its contrast and small-screen layout.

## 4. 🔌 Replace the inline toolbar and connect it to the shell

In the root component, import `Header` and remove `MatToolbarModule` from the root imports because the header now owns the toolbar. Keep Material modules still used by the drawer, such as the icon, list, button, and sidenav modules.

In `app.html`, replace the inline `<mat-toolbar>` with the header component:

```html
<mat-sidenav-content>
  <app-header
    [drawerOpened]="drawerOpened"
    [cartItemCount]="0"
    (menuToggle)="sidenav.toggle()"
  />

  <main class="shell__main">
    <router-outlet />
  </main>
</mat-sidenav-content>
```

Continue binding `[opened]="drawerOpened"` and `(openedChange)="drawerOpened = $event"` on the sidenav. That way menu clicks, backdrop dismissal, Escape, and navigation-triggered close events keep the header's icon, accessible label, and `aria-expanded` value synchronized. Initially, the root can pass a fixed count of `0`; connect the real cart state in Step 6.

## 5. 🛒 Add the cart page route

The current `src/app/app.routes.ts` includes `/home` but not `/cart`. Create a standalone cart page and register it so the header link has a destination:

```ts
import { Cart } from "./cart/cart";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: Home },
  { path: "cart", component: Cart },
];
```

The cart page should display the selected items, quantities, prices, and an empty-cart state. Keep it as a routed page inside the existing `<router-outlet>` rather than turning the navigation sidenav into a cart drawer.

## 6. 📦 Connect a shared cart store when cart behavior is implemented

When products can be added to a cart, use a root-provided service/store as the shared source of truth. Derive the header count from item quantities, rather than storing a separate count that can drift out of sync. For this property-based example, the service owns a mutable property and exposes read-only access plus getters; it does not use Angular signals.

```ts
import { Injectable } from "@angular/core";

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

@Injectable({ providedIn: "root" })
export class CartStore {
  private cartItems: CartItem[] = [];

  get items(): readonly CartItem[] {
    return this.cartItems;
  }

  get itemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  add(product: Omit<CartItem, "quantity">): void {
    const existing = this.cartItems.find(
      (item) => item.productId === product.productId,
    );
    this.cartItems = existing
      ? this.cartItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...this.cartItems, { ...product, quantity: 1 }];
  }
}
```

Expose the store from the root component and bind its count property to the header input:

```ts
protected readonly cartStore = inject(CartStore);
```

```html
<app-header [cartItemCount]="cartStore.itemCount" />
```

The product/menu page calls `CartStore.add(...)`; the cart page reads and updates the same store; the header only displays its derived count and navigates to `/cart`. Decide separately whether to persist cart contents across reloads or sessions.

## 7. ♿ Verify interaction, accessibility, and navigation

Update or add tests for the extracted header and shell:

```ts
expect(element.querySelector("header")).not.toBeNull();
expect(element.querySelector("app-header")).not.toBeNull();
expect(element.querySelector('a[href="/cart"]')).not.toBeNull();
```

Check that:

- The menu button toggles the drawer and updates its icon, accessible label, and `aria-expanded` state.
- Backdrop clicks, Escape, and selecting a navigation item also synchronize that state.
- The cart action navigates to `/cart` and announces the current item count accessibly.
- Adding a product updates both the cart page and header count, including quantities greater than one.
- The header remains usable on narrow screens and has visible keyboard focus.

Run the relevant unit tests and `npm run build` after implementation.

## Suggested implementation order

1. Create the standalone header and move the toolbar markup into its semantic header.
2. Connect header inputs and menu output to the root sidenav state.
3. Add a cart page route and header cart link.
4. Introduce the shared cart store when product/cart behavior is ready.
5. Add tests for state synchronization, cart navigation, and item counts.
