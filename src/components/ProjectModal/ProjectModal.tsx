import { Button, Drawer, Form, Input, message, Select } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  projectActions,
  selectEditingProject,
  selectProjectModalVisible
} from '../../store/project.slice'
import { ErrorBox } from '../Others/Others'
import styles from './ProjectModal.module.scss'
import { useProjectModal } from '../../hooks/project'
import { selectUserList } from '../../store/user.slice'
import { isVoid } from '../../utils/utils'
import { useAppDispatch } from '../../store'
import { Dao } from '../../dao/dao'

/**
 * Project作成、編集Modalコンポーネント
 * @constructor
 */
export const ProjectModal = () => {
  // Reduxから、編集しようとするプロジェクトを取得、作成の場合、undefinedだ
  const editingProject = useSelector(selectEditingProject)
  // Modalのタイトルを設定
  const title = editingProject ? 'プロジェクトの編集' : 'プロジェクトの作成'
  // 操作成功のメッセージを設定
  const msg = editingProject ? '編集は成功した' : '作成は成功した'
  // Modalを閉じるメゾット
  const { modalClose } = useProjectModal()
  // ProjectModalコンポーネントのエラー
  const [projectModalError, setProjectModalError] = useState<Error | undefined>(
    undefined
  )

  // formのインスタンス
  const [form] = Form.useForm()

  // Modalを閉じる処理
  const onClose = () => {
    setProjectModalError(undefined)
    form.resetFields()
    modalClose()
  }
  // 提出ボタンをクリックする処理
  const onFinish = (values: any) => {
    // values.personのフォーマット：1,Jack
    const [personId, personName] = values.person.split(',')
    values.personId = Number(personId) || -1
    values.personName = personName
    values.created = Date.now()
    // idが有効な値なら、projectを更新する
    if (!isVoid(values.id) && values.id !== -1 && values.id !== '-1') {
      // DBにある該当データを更新する
      dao.updateProject(values.id, values).then(_ => {
        // 更新したプロジェクトをReduxに送る
        dispatch(projectActions.updateProjectList(values))
        message.success(msg)
      }, reason => {
        // projectを更新した時に発生したエラー
        setProjectModalError(new Error(reason))
      })
      // idが存在しなければ、新たなprojectを作成する
    } else {
      values.pin = 0
      // 新たに作成するprojectのidは「-1」、「'-1'」、「undefined」などを避けるために、
      // values.idを削除
      delete values.id

      // DBに保存する
      dao.saveProject(values).then(
        (_) => {
          // 保存したprojectをReduxに送る
          dispatch(projectActions.addProject(values))
          message.success(msg)
        },
        (reason) => {
          // projectを保存した時に発生したエラー
          setProjectModalError(new Error(reason))
        }
      )
    }
    // Modalを閉じる
    onClose()
  }


// DataAccessObject
  const dao = Dao.getInstance()
// Reduxから全てのUserをロードする
  let userList = useSelector(selectUserList)
// Redux用
  const dispatch = useAppDispatch()
// editingProjectの値をformに設定する
  useEffect(() => {
    form.setFieldsValue(editingProject)
  }, [editingProject, form])

// Project作成、編集Modalを表示するかどうかをコントロールする変数（Reduxに保存する）
  const projectModalVisible = useSelector(selectProjectModalVisible)

  return (
    <Drawer
      forceRender={true}
      onClose={onClose}
      visible={projectModalVisible}
      width='100%'
    >
      <div className={styles['project-modal-container']}>
        {
          <Fragment>
            <h1>{title}</h1>
            {projectModalError && <ErrorBox error={projectModalError} />}
            <Form
              form={form}
              layout={'vertical'}
              style={{ width: '40rem' }}
              onFinish={onFinish}
            >
              <Form.Item name={'id'}>
                <Input type='hidden' />
              </Form.Item>
              <Form.Item name={'pin'}>
                <Input type='hidden' />
              </Form.Item>
              <Form.Item
                label={'プロジェクトの名前'}
                name={'name'}
                rules={[
                  { required: true, message: 'プロジェクトの名前は空です' }
                ]}
              >
                <Input placeholder={'プロジェクトの名前'} />
              </Form.Item>

              <Form.Item
                label={'担当部門'}
                name={'organization'}
                rules={[{ required: true, message: '担当部門は空です' }]}
              >
                <Input placeholder={'担当部門'} />
              </Form.Item>

              <Form.Item
                label={'担当者'}
                name={'person'}
                rules={[{ required: true, message: '担当者は空です' }]}
              >
                <Select value={''} placeholder='担当者'>
                  {userList.map((user) => (
                    <Select.Option
                      key={user.id}
                      value={String(user.id) + ',' + user.name}
                    >
                      {user.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item style={{ textAlign: 'right' }}>
                <Button type={'primary'} htmlType={'submit'}>
                  提出
                </Button>
              </Form.Item>
            </Form>
          </Fragment>
        }
      </div>
    </Drawer>
  )
}
