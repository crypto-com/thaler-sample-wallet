import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import * as LosslessJSON from "lossless-json";
import * as lodash from "lodash";
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!lodash.isNil(request["body"])) {
      let body = request["body"];
      body["params"] = LosslessJSON.stringify(body["params"]);
      request = request.clone({ body: body });
    }

    request = request.clone({ responseType: "text" });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          event = event.clone({ body: LosslessJSON.parse(event.body) });
        }
        return event;
      })
    );
  }
}
