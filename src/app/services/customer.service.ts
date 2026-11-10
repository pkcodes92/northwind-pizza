import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";

@Service()
export class CustomerService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getCustomers(): Observable<GetCustomersResponse> {
    return this.httpClient.get<GetCustomersResponse>(`${this.apiUrl}/customers`);
  }
}
