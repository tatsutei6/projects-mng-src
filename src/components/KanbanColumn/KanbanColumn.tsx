import React, { useContext, useEffect, useState } from 'react'
import styles from './KanbanColumn.module.scss'

import { Kanban, Task } from '../../models/models'
import { Dao } from '../../dao/dao'
import taskIcon from '../../../public/task.svg'
import busIcon from '../../../public/bug.svg'
import { Card, Image } from 'antd'
import { useAppDispatch } from '../../store'
import { useTasksModal } from '../../hooks/task'
import { taskActions } from '../../store/task.slice'
import { KanbanColumnMoreActions } from './KanbanColumnMoreActions'
import { DataContext } from '../../context/DataContext'
import CreateTask from './CreateTask'

const KanbanColumn = (props: { kanban: Kanban }) => {
  const { kanban } = props
  const [, setTasks] = useState<Task[]>([])

  const { tasksData,  } = useContext(DataContext)

  // Redux用
  const dispatch = useAppDispatch()
  useEffect(() => {
    (async () => {
      const tasks = await Dao.getInstance().getTasksByKanbanId(kanban.id)
      setTasks(tasks)
    })()
  }, [kanban.id])

  // Projectを作成や編集するModalを開くメゾット
  const { modalOpen } = useTasksModal()

  const handleTaskClick = (task: Task) => {
    // 編集しようとするProjectをReduxに送る
    dispatch(taskActions.setEditingTask(task))
    // 編集modalを開く
    modalOpen()
  }
  const tempData = tasksData.get(Number(kanban.id)) || []

  return (
    <div className={styles['kanban-column-container']}>
      <div className={styles['kanban-title-row']}>
        <span>{kanban.name}</span>
        <KanbanColumnMoreActions kanban={kanban} />
      </div>
      {
        tempData.map((task) => {
          return (
            <Card className={styles['task-container']} key={task.id} onClick={() => {
              handleTaskClick(task)
            }}>
              <Image src={task.typeId === 1 ? taskIcon : busIcon} alt={'icon'} width={16} />
              <p style={{ fontSize: '1.6rem', marginTop: '1rem' }}>{task.name}</p>
            </Card>
          )
        })
      }
      <CreateTask kanbanId={kanban.id} projectId={kanban.projectId} />
    </div>)
}

export default KanbanColumn