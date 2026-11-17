import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  imports: [CommonModule],
  selector: "app-under-development",
  styleUrls: ["./under-development.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./under-development.html",
})
export class UnderDevelopment {
  @Input() title = "We're cooking something up!";

  @Input() description =
    "This page is currently under development. Our team is working hard behind the scenes to bring you something delicious. Check back soon!";

  @Input() progressValue = 65;

  @Input() showProgress = false;

  @Input() progressLabel = "Development in progress";

  @Input() eyebrow = "COMING SOON";

  get normalizedProgress(): number {
    return Math.min(100, Math.max(0, this.progressValue));
  }
}
