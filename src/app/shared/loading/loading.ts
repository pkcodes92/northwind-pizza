import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { LoadingService } from "../../services";

@Component({
  imports: [CommonModule],
  selector: "app-loading",
  styleUrls: ["./loading.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./loading.html",
})
export class Loading {
  @Input() message = "Loading...";
  @Input() diameter = 48;
  @Input() strokeWidth = 4;
  @Input() color: "primary" | "accent" | "warn" = "primary";

  private loading = inject(LoadingService);

  readonly isLoading$ = this.loading.isLoading$;
  readonly message$ = this.loading.message$;
}
