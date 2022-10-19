import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ZipCodeService {

    private path: string = 'https://viacep.com.br/ws/';

    constructor(private http: HttpClient) { }

    async get(zipCode: string) {
        let req: string = this.path;
        req += zipCode;
        req += '/json';
        return this.http.get(req);
    }
}