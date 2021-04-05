import React from 'react'
import { Modal, Button, Typography, Space, Radio, Checkbox } from 'antd'

import type { User, Project } from '@/models'
import { useCounter, useControllableValue, useRequest } from '@/hooks'
import { IconButton } from '@/components'
import api from '@/api'

import styles from './Invite.module.less'

const defaultValue = {
  memberState: 'default',
  projectCheckedList: [],
  projectCheckAll: false,
  projectIndeterminate: false,
}
interface InviteProps {
  projects?: Project[]
  organization_id?: number | string
  user?: User
  visible: boolean
  onCancel: () => void
}
const Invite: React.FC<InviteProps> = ({
  projects,
  organization_id,
  user,
  visible,
  onCancel,
}) => {
  const [currentStep, { inc, dec, reset }] = useCounter(0, { min: 0, max: 2 })
  const [memberState, setMemberState] = useControllableValue(undefined, {
    defaultValue: defaultValue.memberState,
  })
  const projectOptions = React.useMemo(
    () =>
      projects?.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [projects]
  )
  const allProjectOptions = React.useMemo(
    () => projects?.map((item) => item.id),
    [projects]
  )
  const [projectCheckedList, setProjectCheckedList] = React.useState<number[]>(
    defaultValue.projectCheckedList
  )
  const [projectCheckAll, setProjectCheckAll] = React.useState<boolean>(
    defaultValue.projectCheckAll
  )
  const [
    projectIndeterminate,
    setProjectIndeterminate,
  ] = React.useState<boolean>(defaultValue.projectIndeterminate)
  const handleProjectCheckedList = React.useCallback(
    (checkedList: number[]) => {
      setProjectCheckedList(checkedList)
      setProjectCheckAll(checkedList.length === allProjectOptions!.length)
      setProjectIndeterminate(
        !!checkedList.length && checkedList.length < allProjectOptions!.length
      )
    },
    [allProjectOptions]
  )
  const handleProjectCheckAll = React.useCallback(
    (e) => {
      setProjectCheckedList(e.target.checked ? allProjectOptions! : [])
      setProjectCheckAll(e.target.checked)
      setProjectIndeterminate(false)
    },
    [allProjectOptions]
  )
  const handleReset = React.useCallback(() => {
    reset()
    setProjectCheckedList(defaultValue.projectCheckedList)
    setProjectCheckAll(defaultValue.projectCheckAll)
    setProjectIndeterminate(defaultValue.projectIndeterminate)
  }, [])
  const { data, run } = useRequest(api.invite.url, { manual: true })
  const handleNext = React.useCallback(
    async (sendRequest = false) => {
      inc()
      if (sendRequest) {
        // 发送请求 获取邀请链接
        if (organization_id && user) {
          await run({
            auth: memberState!,
            projects: projectCheckedList,
            organization_id: Number(organization_id),
            inviter_id: user?.id,
          })
        }
      }
    },
    [inc, organization_id, user, run, memberState, projectCheckedList]
  )

  const steps = React.useMemo(() => {
    return [
      <div className={styles.step1} key="step1">
        <Space direction="vertical" align="center" size="large">
          <Radio.Group
            className={styles.radioGroup}
            value={memberState}
            onChange={(e) => setMemberState(e.target.value)}
          >
            <Space direction="vertical">
              {/* <div className={styles.radioItem}> */}
              {/*  <Radio value="sub_admin">管理员</Radio> */}
              {/*  <Typography.Text type="secondary">创建、删除项目/管理成员</Typography.Text> */}
              {/* </div> */}
              <div className={styles.radioItem}>
                <Radio value="default">查看着</Radio>
                <Typography.Text type="secondary">查看Issue</Typography.Text>
              </div>
            </Space>
          </Radio.Group>
          <Button type="primary" onClick={() => handleNext(false)}>
            生成链接
          </Button>
        </Space>
      </div>,
      <div className={styles.step2} key="step2">
        <div className={styles.content}>
          <div className={styles.projectItem}>
            <span className={styles.title}>选择参与的项目</span>
            <Checkbox
              checked={projectCheckAll}
              onChange={handleProjectCheckAll}
              indeterminate={projectIndeterminate}
            >
              全选
            </Checkbox>
          </div>
          <Checkbox.Group
            className={styles.projectGroup}
            value={projectCheckedList}
            onChange={(checkedList) =>
              handleProjectCheckedList(checkedList as number[])
            }
          >
            {projectOptions?.map((item) => (
              <label className={styles.projectItem} key={item.value}>
                {item.label}
                <Checkbox value={item.value} />
              </label>
            ))}
          </Checkbox.Group>
        </div>

        <div className={styles.footer}>
          <span>已选择{projectCheckedList.length}个项目</span>

          <div className={styles.buttons}>
            <Button type="primary" onClick={() => handleNext(true)}>
              确定
            </Button>
          </div>
        </div>
      </div>,
      <div className={styles.step3} key="step3">
        <Space direction="vertical">
          <Typography.Text className={styles.title}>
            将链接发给小伙伴就可以啦
          </Typography.Text>
          {data && (
            <Typography.Text className={styles.copyableInput} copyable>
              {data}
            </Typography.Text>
          )}
          <Typography.Text type="secondary">邀请有效期为14天</Typography.Text>
        </Space>
        <Button className={styles.continue} type="link" onClick={handleReset}>
          继续邀请
        </Button>
      </div>,
    ]
  }, [
    memberState,
    projectCheckAll,
    handleProjectCheckAll,
    projectIndeterminate,
    projectCheckedList,
    projectOptions,
    data,
    handleReset,
    setMemberState,
    handleNext,
    handleProjectCheckedList,
  ])

  return (
    <Modal
      className={styles.root}
      title={
        <div className={styles.title}>
          {Boolean(currentStep) && (
            <IconButton
              className={styles.back}
              icon="icon-ohbug-arrow-left-s-line"
              onClick={() => dec()}
            />
          )}
          邀请成员
        </div>
      }
      footer={null}
      width={600}
      centered
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
    >
      <div className={styles.container}>{steps[currentStep]}</div>
    </Modal>
  )
}

export default Invite
