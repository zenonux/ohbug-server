import React from 'react'
import { Modal, Button, Checkbox, message } from 'antd'

import type { User, Project, Organization } from '@/models'
import { useRequest } from '@/hooks'
import api from '@/api'

import styles from './InviteProject.module.less'

const defaultValue = {
  checkedList: [],
  checkAll: false,
  indeterminate: false,
}
interface InviteProps {
  project?: Project
  organization?: Organization
  user?: User
  visible: boolean
  onCancel: () => void
}
const InviteProject: React.FC<InviteProps> = ({
  project,
  organization,
  user,
  visible,
  onCancel,
}) => {
  const users = React.useMemo(
    () =>
      organization?.users
        // @ts-ignore
        ?.filter((item) => !project?.users.map((v) => v.id).includes(item.id)),
    [organization, project]
  )
  const allOptions = React.useMemo(() => users?.map((item) => item.id), [users])
  const [checkedList, setCheckedList] = React.useState<number[]>(
    defaultValue.checkedList
  )
  const [checkAll, setCheckAll] = React.useState<boolean>(defaultValue.checkAll)
  const [indeterminate, setIndeterminate] = React.useState<boolean>(
    defaultValue.indeterminate
  )
  const handleCheckedList = React.useCallback(
    (data: number[]) => {
      setCheckedList(data)
      setCheckAll(data.length === allOptions!.length)
      setIndeterminate(!!data.length && data.length < allOptions!.length)
    },
    [allOptions]
  )
  const handleCheckAll = React.useCallback(
    (e) => {
      // @ts-ignore
      setCheckedList(e.target.checked ? allOptions! : [])
      setCheckAll(e.target.checked)
      setIndeterminate(false)
    },
    [allOptions]
  )
  const { run } = useRequest(api.invite.bindProject, { manual: true })
  const handleSubmit = React.useCallback(async () => {
    if (project?.id && checkedList.length) {
      await run({
        users: checkedList,
        project_id: project?.id,
      })
    } else {
      message.warning('请选择成员')
    }
  }, [checkedList, project?.id, run])

  return (
    <Modal
      className={styles.root}
      title={<div className={styles.title}>邀请成员</div>}
      footer={null}
      width={600}
      centered
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
    >
      <div className={styles.container}>
        {users?.length ? (
          <div className={styles.content}>
            <div className={styles.projectItem}>
              <span className={styles.title}>选择成员</span>
              <Checkbox
                checked={checkAll}
                onChange={handleCheckAll}
                indeterminate={indeterminate}
              >
                全选
              </Checkbox>
            </div>
            <Checkbox.Group
              className={styles.projectGroup}
              value={checkedList}
              onChange={(value) => handleCheckedList(value as number[])}
            >
              {users?.map((item) => (
                <label className={styles.projectItem} key={item.id}>
                  {item.name}
                  <Checkbox value={item.id} />
                </label>
              ))}
            </Checkbox.Group>
          </div>
        ) : (
          <div>没啦</div>
        )}

        <div className={styles.footer}>
          <span>已选择{checkedList.length}名成员</span>

          <div className={styles.buttons}>
            <Button type="primary" onClick={handleSubmit}>
              确定
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InviteProject
