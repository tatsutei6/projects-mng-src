import { Button, Dropdown, Menu, Modal } from 'antd'
import { Kanban } from '../../models/models'
import { Dao } from '../../dao/dao'
import { useContext } from 'react'
import { DataContext } from '../../context/DataContext'

export const KanbanColumnMoreActions = (props: { kanban: Kanban }) => {
  const { tasksData, setTasksData } = useContext(DataContext)
  const { kanbansData, setKanbansData } = useContext(DataContext)

  const startDelete = () => {
    Modal.confirm({
      okText: '確定',
      cancelText: 'キャンセル',
      title: '削除しますか',
      onOk() {
        (async () => {
          await Dao.getInstance().deleteKanban(props.kanban.id)
          setKanbansData(kanbansData.filter((kanban) => kanban.id !== props.kanban.id))
          tasksData.delete(Number(props.kanban.id))
          setTasksData(new Map(tasksData))
          // 看板が削除されたら、その看板に紐づくタスクも削除する
          await Dao.getInstance().deleteTasksByKanbanId(props.kanban.id)
        })()
        // Dao.getInstance().deleteKanban(props.kanban.id).then(() => {
        //   props.setKanbans(props.kanbans.filter((kanban) => kanban.id !== props.kanban.id))
        // })
      }
    })
  }
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type={'link'} danger={true} onClick={startDelete}>
          削除
        </Button>
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown overlay={overlay}>
      <Button type={'link'}>...</Button>
    </Dropdown>
  )
}