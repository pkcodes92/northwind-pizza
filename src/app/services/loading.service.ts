import { Service } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Service()
export class LoadingService {
  private counter = 0;
  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  readonly isLoading$: Observable<boolean> = this._isLoading.asObservable();

  private readonly _message = new BehaviorSubject<string>("");
  readonly message$: Observable<string> = this._message.asObservable();

  show(message?: string) {
    this.counter++;

    if (message != undefined) {
      this._message.next(message);
    }

    if (this.counter === 1) {
      this._isLoading.next(true);
    }
  }

  hide() {
    if (this.counter > 0) {
      this.counter--;
    }

    if (this.counter === 0) {
      this._isLoading.next(false);
      this._message.next("");
    }
  }

  setMessage(message: string) {
    this._message.next(message ?? "");
  }

  reset() {
    this.counter = 0;
    this._isLoading.next(false);
    this._message.next("");
  }
}
