# Angular Material Application Shell Plan

> **Scope:** This is an implementation plan only. No application code is changed by this document.

The project already has Angular Material installed and a global Material theme configured in `src/material-theme.scss`. The root component and template now have a sidenav shell draft, with `drawerMode` and `drawerOpened` state. The steps below focus on completing the shell and keeping the UI synchronized when the drawer opens or closes. The routes redirect `/` to `/home`; `Auth` exists but is not currently included in the routes.

## 1. 🧭 Define the shell navigation and route behavior

Decide which pages belong inside the shared shell. Begin with Home and add other destinations as their routes are introduced. Keep login/authentication pages outside the shell if they should not display application navigation; that can be handled with a separate layout or route grouping later.

Navigation entries can be represented as typed data in `src/app/app.ts`:

```ts
interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

export class App {
  protected readonly navigationItems: NavigationItem[] = [
    { label: "Home", route: "/home", icon: "home" },
  ];
}
```

Confirm that each `route` matches an actual route in `src/app/app.routes.ts`. The existing default redirect to `/home` can remain.

## 2. 🧱 Add Angular Material controls to the standalone root component

Update the root component in `src/app/app.ts` to import the Material controls used by the shell. Keep `RouterOutlet` and add `RouterLink`/`RouterLinkActive` for navigation.

```ts
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  styleUrl: "./app.css",
  templateUrl: "./app.html",
})
export class App {}
```

Use the Material modules that correspond to the controls actually used; if the installed Material version exposes standalone component imports in the project conventions, those can be used instead.

## 3. 🧩 Build the shell and synchronize open/close state

In `src/app/app.html`, put the toolbar and routed page content inside `mat-sidenav-content`, and place navigation links inside `mat-sidenav`. Bind the sidenav's `opened` input to `drawerOpened` and listen to `openedChange` so changes from the menu button, navigation link, or backdrop update the component state. This lets the button's label, expanded state, and icon respond immediately.

```html
<mat-sidenav-container class="shell">
  <mat-sidenav
    #sidenav
    id="main-navigation"
    [mode]="drawerMode"
    [opened]="drawerOpened"
    (openedChange)="drawerOpened = $event"
    role="navigation"
  >
    <mat-nav-list aria-label="Main navigation">
      @for (item of navigationItems; track item.route) {
        <a
          mat-list-item
          [routerLink]="item.route"
          routerLinkActive="active-link"
          (click)="sidenav.close()"
        >
          <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
          <span matListItemTitle>{{ item.label }}</span>
        </a>
      }
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    <mat-toolbar>
      <button
        mat-icon-button
        type="button"
        [attr.aria-label]="drawerOpened ? 'Close navigation menu' : 'Open navigation menu'"
        [attr.aria-expanded]="drawerOpened"
        aria-controls="main-navigation"
        (click)="sidenav.toggle()"
      >
        <mat-icon>{{ drawerOpened ? "close" : "menu" }}</mat-icon>
      </button>
      <span>Northwind Pizza</span>
    </mat-toolbar>

    <main class="shell__main">
      <router-outlet />
    </main>
  </mat-sidenav-content>
</mat-sidenav-container>
```

Give the sidenav the matching `id="main-navigation"` for the button's `aria-controls`. In `over` mode the drawer overlays the page; selecting a destination or clicking the backdrop closes it, and `openedChange` keeps `drawerOpened` current in both cases.

An alternative is Angular's two-way binding, `[(opened)]="drawerOpened"`. Use either that or the explicit `[opened]`/`(openedChange)` pair above, not both. If using one-way `[opened]` alone, the UI state will not be synchronized after a user-triggered close or open.

## 4. 🧹 Remove competing root navigation and replace starter styles

In `src/app/app.ts`, remove the `OnInit` navigation to `/` and its `Router` injection. The router's `path: ""` redirect in `src/app/app.routes.ts` should own the initial URL. This avoids imperative navigation competing with direct links or later route handling.

```ts
export class App {
  protected readonly navigationItems: NavigationItem[] = [
    { label: "Home", route: "/home", icon: "home" },
  ];
}
```

Replace the Angular starter-page layout rules in `src/app/app.css` with shell sizing and content spacing:

```css
:host {
  display: block;
  height: 100dvh;
}

.shell {
  height: 100%;
}

.shell__main {
  min-height: calc(100% - 64px);
  padding: 1.5rem;
  box-sizing: border-box;
}

.active-link {
  font-weight: 600;
}
```

Adjust the toolbar offset for compact/mobile toolbar height if needed. Keep page-specific styles in the routed page components rather than styling all page content from the shell.

## 5. 📱 Make drawer behavior responsive

Use the existing drawer fields in `src/app/app.ts`. At wide widths, choose `side` mode and open the drawer; at narrow widths, choose `over` mode and let the user toggle it. Keep the viewport update separate from the open/close event synchronization in Step 3 so changing breakpoints and user interaction both update the view.

```ts
export class App {
  protected drawerMode: "over" | "side" = "over";
  protected drawerOpened = false;

  protected updateDrawerForViewport(isWide: boolean): void {
    this.drawerMode = isWide ? "side" : "over";
    this.drawerOpened = isWide;
  }
}
```

Use Angular CDK `BreakpointObserver` to call `updateDrawerForViewport` when crossing an explicit breakpoint, such as `960px`, and manage the observable subscription with `takeUntilDestroyed`. The template should retain both state bindings:

```html
<mat-sidenav
  #sidenav
  [mode]="drawerMode"
  [opened]="drawerOpened"
  (openedChange)="drawerOpened = $event"
  role="navigation"
>
```

When the drawer opens or closes, the toolbar button's accessible label and icon should reflect the current `drawerOpened` value, as shown in Step 3. Verify that backdrop clicks, Escape, navigation selection, and the toolbar button all result in the expected state at narrow widths. At wide widths, verify that the side drawer pushes the page content as intended.

## 6. 🧪 Update tests and verify the shell

Update `src/app/app.spec.ts` to test the new shell instead of the removed starter heading. Import the app and check for the toolbar, navigation control, and routed content container.

```ts
it("renders the application shell", () => {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();

  const element = fixture.nativeElement as HTMLElement;
  expect(element.querySelector("mat-sidenav-container")).not.toBeNull();
  expect(element.querySelector("mat-toolbar")).not.toBeNull();
  expect(element.querySelector("router-outlet")).not.toBeNull();
});

it("updates the menu button when the sidenav opens and closes", async () => {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  const button = fixture.nativeElement.querySelector(
    'button[aria-controls="main-navigation"]',
  ) as HTMLButtonElement;

  button.click();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(button.getAttribute("aria-expanded")).toBe("true");
  expect(button.getAttribute("aria-label")).toBe("Close navigation menu");

  button.click();
  await fixture.whenStable();
  fixture.detectChanges();
  expect(button.getAttribute("aria-expanded")).toBe("false");
  expect(button.getAttribute("aria-label")).toBe("Open navigation menu");
});
```

Then verify the project with:

```bash
npm test -- --watch=false
npm run build
```

Also manually check `/` and `/home`, the active navigation state, drawer toggle and close behavior, keyboard focus, and narrow-screen layout.

## Suggested implementation order

1. Decide which routes use the shell.
2. Add navigation data and Material imports.
3. Build the toolbar, sidenav, and router outlet template.
4. Remove imperative initial navigation and replace starter styles.
5. Add responsive drawer behavior if a persistent desktop sidebar is desired.
6. Update tests and run the test/build checks.
