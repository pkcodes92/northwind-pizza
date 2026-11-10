import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { ErrorResponse, GetPizzasResponse } from "../dto/response";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment.development";

@Service()
export class PizzaService {
  private httpClient = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getPizzas(): Observable<GetPizzasResponse> {
    return this.httpClient.get<GetPizzasResponse>(`${this.apiUrl}/pizzas`).pipe(
      catchError((error) => {
        const errorRes = error.error as ErrorResponse;
        return throwError(() => errorRes);
      }),
    );
  }
}
