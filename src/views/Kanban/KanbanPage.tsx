import React, { useEffect, useState } from 'react'
import styles from './KanbanPage.module.scss'
import { Dao } from '../../dao/dao'
import { Kanban, Task } from '../../models/models'
import KanbanColumn from '../../components/KanbanColumn/KanbanColumn'
import CreateKanban from '../../components/KanbanColumn/CreateKanban'
import { TaskModal } from '../../components/KanbanColumn/TaskModal'
import { DataContext } from '../../context/DataContext'

const KanbanPage = (props: { projectId: number | string }) => {
  const [kanbansData, setKanbansData] = useState<Kanban[]>([])
  const [tasksData, setTasksData] = React.useState<Map<string | number, Array<Task>>>(new Map())


  useEffect(() => {
    (async () => {
      const kanbans = await Dao.getInstance().getKanbansByProjectId(Number(props.projectId))
      setKanbansData(kanbans)
      for (const ele of kanbans) {
        const tasks = await Dao.getInstance().getTasksByKanbanId(ele.id)
        tasksData.set(Number(ele.id), tasks)
      }
      setTasksData(new Map(tasksData))
    })()
  }, [setTasksData, props.projectId])
  return (
    <DataContext.Provider value={{ tasksData, setTasksData, kanbansData, setKanbansData }}>
      <div className={styles['kanban-container']}>
        <h3>看板</h3>
        <div className={styles['kanban-column-outer-container']}>
          {
            kanbansData?.map((kanban) => {
              return (
                <KanbanColumn key={kanban.id} kanban={kanban} />
              )
            })
          }
          <CreateKanban projectId={props.projectId} setKanbans={setKanbansData} />
        </div>
        <TaskModal kanbans={kanbansData} />
      </div>
    </DataContext.Provider>
  )
}

export default KanbanPage