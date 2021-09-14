import { Controller, Get, Param, Query } from '@nestjs/common'

import { Extension } from '@ohbug-server/common'

import { ExtensionService } from './extension.service'
import { GetExtensionDto, SearchExtensionsDto } from './extension.dto'

const limit = 20

@Controller('extensions')
export class ExtensionController {
  constructor(private readonly extensionService: ExtensionService) {}

  /**
   * 根据 id 获取库里的指定 Extension
   *
   * @param extensionId
   */
  @Get(':extensionId')
  async get(@Param() { extensionId }: GetExtensionDto): Promise<Extension> {
    return this.extensionService.getExtensionDetailById(extensionId)
  }

  /**
   * 搜索 extensions
   *
   * @param page
   */
  @Get()
  async searchExtensions(
    @Query() { page }: SearchExtensionsDto
  ): Promise<[Extension[], number]> {
    const take = limit
    const skip = parseInt(page, 10) * limit
    return this.extensionService.searchExtensions({ take, skip })
  }
}
