import { Injectable } from '@nestjs/common'
import type { NestInterceptor, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'

interface Response<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(_: never, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        success: true,
      }))
    )
  }
}
