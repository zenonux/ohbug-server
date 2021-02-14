import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import dayjs from 'dayjs'
import { v4 as uuid_v4 } from 'uuid'

import { ForbiddenException, md5, getHost } from '@ohbug-server/common'
import { ProjectService } from '@/api/project/project.service'
import { OrganizationService } from '@/api/organization/organization.service'
import { UserService } from '@/api/user/user.service'

import { Invite } from './invite.entity'
import {
  BindProjectDto,
  BindUserDto,
  CreateInviteUrlDto,
  GetInviteDto,
} from './invite.dto'

const expire = 14

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
    private readonly projectService: ProjectService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService
  ) {}

  /**
   * 获取邀请链接
   *
   * @param auth
   * @param projects
   * @param organization_id
   * @param inviter_id
   */
  async createInviteUrl({
    auth,
    projects,
    organization_id,
    inviter_id,
  }: CreateInviteUrlDto) {
    try {
      const hash = md5([auth, projects, organization_id, inviter_id].join(','))
      let invite = await this.inviteRepository.findOne({
        hash,
      })
      if (invite) {
        return invite.url
      } else {
        const uuid = uuid_v4()
        const url = `${getHost()}/invite?id=${uuid}`
        invite = this.inviteRepository.create({
          uuid,
          hash,
          auth,
          url,
          expires: dayjs().add(expire, 'day').toISOString(),
          projects: projects
            ? await this.projectService.getProjectsByProjectIds(projects)
            : undefined,
          organization: await this.organizationService.getOrganizationById(
            organization_id
          ),
          inviter: await this.userService.getUserById(inviter_id),
        })
        const result = await this.inviteRepository.save(invite)
        return result.url
      }
    } catch (error) {
      throw new ForbiddenException(4001200, error)
    }
  }

  /**
   * 根据 uuid 获取 invite 信息
   *
   * @param uuid
   */
  async getInviteByUUID({ uuid }: GetInviteDto) {
    try {
      return await this.inviteRepository.findOneOrFail({
        where: { uuid },
        relations: [
          'projects',
          'organization',
          'inviter',
          'projects.users',
          'organization.users',
        ],
      })
    } catch (error) {
      throw new ForbiddenException(4001201, error)
    }
  }

  /**
   * 绑定 用户与 团队/项目
   *
   * @param user_id
   * @param uuid
   */
  async bindUser({ user_id, uuid }: BindUserDto) {
    try {
      const { projects, organization } = await this.getInviteByUUID({ uuid })
      const user = await this.userService.getUserById(user_id)
      await this.organizationService.addUser(organization, [user])
      for (const project of projects) {
        await this.projectService.addUser(project, [user])
      }
      return user
    } catch (error) {
      throw new ForbiddenException(4001202, error)
    }
  }

  /**
   * 绑定用户与项目
   *
   * @param users
   * @param project_id
   */
  async bindProject({ users, project_id }: BindProjectDto) {
    try {
      const user = await this.userService.getUserByIds(users)
      const project = await this.projectService.getProjectByProjectId(
        project_id
      )
      return await this.projectService.addUser(project, user)
    } catch (error) {
      throw new ForbiddenException(4001203, error)
    }
  }
}
