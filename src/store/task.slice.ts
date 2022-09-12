import { Task } from '../models/models'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './index'

interface TaskState {
  taskModalVisible: boolean
  editingTask: Task | undefined
}

const initialTaskState: TaskState = {
  taskModalVisible: false,
  editingTask: undefined,
}

export const taskSlice = createSlice({
  name: 'taskSlice',
  initialState: initialTaskState,
  reducers: {
    openTaskModal(state) {
      // redux-toolkit 利用immer，immer底层会新建一个影子对象，并将projectModalVisible = true赋值给新的影子对象上，
      // react进行比较，得到不想等，进行从新渲染
      state.taskModalVisible = true
    },
    closeTaskModal(state) {
      state.taskModalVisible = false
    },
    setEditingTask(state, action) {
      state.editingTask = action.payload
    }
  }
})

export const taskActions = taskSlice.actions

export const selectTaskModalVisible = (state: RootState) => {
  return state.task.taskModalVisible
}

export const selectEditingTask = (state: RootState) => {
  return state.task.editingTask
}

