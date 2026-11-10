import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { catchError, Observable, throwError } from "rxjs";
import { ErrorResponse, GetCustomersResponse } from "../dto/response";

@Service()
export class CustomerService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getCustomers(): Observable<GetCustomersResponse> {
    return this.httpClient.get<GetCustomersResponse>(`${this.apiUrl}/customers`).pipe(
      catchError((error) => {
        const errorRes = error.error as ErrorResponse;
        return throwError(() => errorRes);
      }),
    );
  }
}
