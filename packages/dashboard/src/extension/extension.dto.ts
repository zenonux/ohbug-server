import { IsNumber, IsNumberString } from 'class-validator'
import { Type } from 'class-transformer'

export class GetExtensionDto {
  @Type(() => Number)
  @IsNumber()
  readonly extensionId: number
}

export class SearchExtensionsDto {
  @IsNumberString()
  readonly page: string
}
