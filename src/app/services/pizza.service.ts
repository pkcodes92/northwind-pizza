import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Service } from "@angular/core";
import { GetPizzasResponse } from "../dto/response";
import { catchError, Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class PizzaService {
  private httpClient = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getPizzas(): Observable<GetPizzasResponse> {
    return this.httpClient.get<GetPizzasResponse>(`${this.apiUrl}/pizzas`).pipe(
      catchError((error) => {
        console.error("Error fetching pizzas:", error);
        throw error;
      }),
    );
  }
}
