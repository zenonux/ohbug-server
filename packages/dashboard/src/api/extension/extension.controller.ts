import { Controller, Get, Param, Query } from '@nestjs/common'

import { ExtensionService } from './extension.service'
import { Extension } from './extension.entity'
import { GetExtensionDto, SearchExtensionsDto } from './extension.dto'

const limit = 20

@Controller('extensions')
export class ExtensionController {
  constructor(private readonly extensionService: ExtensionService) {}

  /**
   * 根据 id 获取库里的指定 Extension
   *
   * @param extension_id
   */
  @Get(':extension_id')
  async get(@Param() { extension_id }: GetExtensionDto): Promise<Extension> {
    return await this.extensionService.getExtensionDetailById(extension_id)
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
    return await this.extensionService.searchExtensions({ take, skip })
  }
}
