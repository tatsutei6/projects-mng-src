import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import styles from './KanbanColumn.module.scss'
import { Input } from 'antd'
import { Dao } from '../../dao/dao'
import { Kanban } from '../../models/models'
import { DataContext } from '../../context/DataContext'

const CreateKanban = (props: { projectId: number | string, setKanbans: Dispatch<SetStateAction<Kanban[]>> }) => {
  const [name, setName] = useState('')
  const { tasksData, setTasksData } = useContext(DataContext)

  const submit = () => {
    if (name == null || name.trim().length === 0) {
      return
    }
    (async () => {
      await Dao.getInstance().saveKanban(props.projectId, name)
      const kanbans=await Dao.getInstance().getKanbansByProjectId(Number(props.projectId))
      props.setKanbans(kanbans)
      // rebuild tasksData in context
      for (const ele of kanbans) {
        if(!tasksData.has(Number(ele.id))){
          tasksData.set(Number(ele.id), [])
          setTasksData(new Map(tasksData))
          break
        }
      }
      setName('')
    })()
  }

  return (
    <div className={styles['kanban-column-container']}>
      <Input
        size={'large'}
        placeholder={'enterキーで追加'}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </div>
  )
}

export default CreateKanban