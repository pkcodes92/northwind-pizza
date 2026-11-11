import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

import { environment } from "../../environments/environment.development";
import { CreateOrderResponse, ErrorResponse } from "../dto/response";
import { CreateOrderRequest } from "../dto/request";

@Service()
export class OrderService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.httpClient.post<CreateOrderResponse>(`${this.apiUrl}/orders`, request).pipe(
      catchError((error) => {
        const errorRes = error.error as ErrorResponse;
        return throwError(() => errorRes);
      }),
    );
  }
}
