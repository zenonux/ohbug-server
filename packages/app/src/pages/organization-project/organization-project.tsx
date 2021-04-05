import React from 'react'
import { PageHeader, Button } from 'antd'

import { useModel, navigate } from '@/ability'
import { Layout, Icon } from '@/components'
import { isAdmin } from '@/utils'

import OrganizationTree from './components/OrganizationTree'
import styles from './organization-project.module.less'

interface ProjectPageProps {
  children?: React.ReactNode
}

const OrganizationProject: React.FC<ProjectPageProps> = ({ children }) => {
  const organizationModel = useModel('organization')
  const projectModel = useModel('project')
  const userModel = useModel('user')
  const organizations = organizationModel.state.data
  const organization = organizationModel.state.current
  const projects = projectModel.state.data
  const user = userModel.state.current

  const handleCreateOrganization = React.useCallback(() => {
    navigate('/create-organization')
  }, [])
  const handleCreateProject = React.useCallback(() => {
    navigate('/create-project')
  }, [])

  return (
    <Layout
      className={styles.root}
      pageHeader={
        <PageHeader
          title={
            <div className={styles.title}>
              <Button
                icon={<Icon type="icon-ohbug-add-circle-line" />}
                onClick={handleCreateOrganization}
              >
                创建团队
              </Button>
              {isAdmin(organization?.admin?.id, user?.id) && (
                <Button
                  icon={<Icon type="icon-ohbug-add-circle-line" />}
                  onClick={handleCreateProject}
                >
                  创建项目
                </Button>
              )}
            </div>
          }
          ghost
        />
      }
    >
      {organizations && organization && projects && (
        <OrganizationTree organization={organization} projects={projects} />
      )}
      {children}
    </Layout>
  )
}

export default OrganizationProject
