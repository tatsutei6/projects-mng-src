import React from 'react'
import { Kanban, Task } from '../models/models'


export const DataContext = React.createContext<{
  tasksData: Map<string | number, Array<Task>>,
  setTasksData: (data: Map<string | number, Array<Task>>) => void,
  kanbansData: Array<Kanban>,
  setKanbansData: (data: Array<Kanban>) => void
}>({
  tasksData: new Map(),
  setTasksData: (data: Map<string | number, Array<Task>>) => {
  },
  kanbansData: [],
  setKanbansData: (data: Array<Kanban>) => {
  }
})

