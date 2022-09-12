import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Select } from 'antd'
import { useTasksModal } from '../../hooks/task'
import { Dao } from '../../dao/dao'
import { Kanban, User } from '../../models/models'
import { useSelector } from 'react-redux'
import { selectEditingTask, selectTaskModalVisible, taskActions } from '../../store/task.slice'
import { useAppDispatch } from '../../store'
import { DataContext } from '../../context/DataContext'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export const TaskModal = (props: { kanbans: Kanban[] }) => {
  const [form] = Form.useForm()
  const [userList, setUserList] = useState<User[]>([])
  const taskModalVisible = useSelector(selectTaskModalVisible)
  const { modalClose } = useTasksModal()
  const dispatch = useAppDispatch()
  const { tasksData, setTasksData } = useContext(DataContext)

  useEffect(() => {
    (async () => {
      const users = await Dao.getInstance().getAllUsers()
      setUserList(users)
    })()
  }, [])

  const onCancel = () => {
    modalClose()
    dispatch(taskActions.setEditingTask(undefined))
  }
  // Reduxから、編集しようとするプロジェクトを取得、作成の場合、undefinedだ
  const editingTask = useSelector(selectEditingTask)

  const onOk = () => {
    (async () => {
      const newTask = { ...editingTask, ...form.getFieldsValue() }
      await Dao.getInstance().updateTask(editingTask?.id, newTask)

      if (editingTask?.kanbanId !== newTask?.kanbanId!) {
        // 既存のタスクの所属看板を変更した場合
        const oldData = tasksData.get(Number(editingTask?.kanbanId)) || []
        const oldIndex = oldData.findIndex((ele) => ele.id === editingTask?.id)
        oldData.splice(oldIndex, 1)
        // sort array by id
        oldData.sort((a: any, b: any) => a.id - b.id)
        const newData = tasksData.get(Number(newTask?.kanbanId)) || []
        newData.push(newTask)
        newData.sort((a: any, b: any) => a.id - b.id)
        setTasksData(new Map(tasksData))
      }else if(editingTask!==undefined){
        const oldData = tasksData.get(Number(editingTask.kanbanId)) || []
        const toUpdateIndex = oldData.findIndex((ele) => ele.id === editingTask?.id)
        oldData[toUpdateIndex] = newTask
        tasksData.set(Number(editingTask.kanbanId), oldData)
        setTasksData(new Map(tasksData))
      }
      modalClose()
      form.resetFields()
      dispatch(taskActions.setEditingTask(undefined))
    })()

  }

  const startDelete = () => {
    modalClose()
    Modal.confirm({
      okText: '確定',
      cancelText: 'キャンセル',
      title: 'タスクを削除しますか',
      onOk() {
        if (editingTask && editingTask.id) {
          (async () => {
            await Dao.getInstance().deleteTask(editingTask.id)
            let tempData = tasksData.get(Number(editingTask?.kanbanId)) || []
            const toDeleteIndex = tempData.findIndex((ele) => ele.id === editingTask.id)
            tempData.splice(toDeleteIndex, 1)
            tasksData.set(Number(editingTask?.kanbanId), tempData)
            setTasksData(new Map(tasksData))
            modalClose()
            form.resetFields()
            dispatch(taskActions.setEditingTask(undefined))
          })()
        }
      }
    })
  }

  const userOptions = useMemo(() => {
    return userList.map((user) => {
      return {
        label: user.name,
        value: user.id,
        key: user.id
      }
    })
  }, [userList])

  useEffect(() => {
    form.setFieldsValue(editingTask)
  }, [form, editingTask])

  const typeOptions = [
    {
      label: 'タスク',
      value: 1,
      key: 1
    },
    {
      label: 'バグ',
      value: 2,
      key: 2
    }
  ]

  const kanbanOptions = props.kanbans.map((kanban) => {
      return {
        label: kanban.name,
        value: kanban.id,
        key: kanban.id
      }
    }
  )


  return (
    <Modal
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      okText={'確定'}
      cancelText={'キャンセル'}
      title={'タスク編集'}
      visible={taskModalVisible}
    >
      <Form {...layout} form={form}>
        <Form.Item
          label={'タスク名'}
          name={'name'}
          rules={[{ required: true, message: 'タスク名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={'担当者'} name={'personId'}>
          <Select value={''} placeholder='担当者' options={userOptions} />
        </Form.Item>
        <Form.Item label={'タイプ'} name={'typeId'}>
          <Select value={''} placeholder='タスクのタイプ' options={typeOptions} />
        </Form.Item>
        <Form.Item label={'看板'} name={'kanbanId'}>
          <Select value={''} placeholder='所属看板' options={kanbanOptions} />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          danger={true}
          onClick={startDelete}
          style={{ fontSize: '1.25rem' }}
          size={'small'}
        >
          削除
        </Button>
      </div>
    </Modal>
  )
}
