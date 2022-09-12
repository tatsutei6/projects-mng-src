import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '.'
import { Project } from '../models/models'

interface ProjectState {
  projectModalVisible: boolean
  projectList: Project[]
  editingProject: Project | undefined
}

const initialProjectState: ProjectState = {
  projectModalVisible: false,
  projectList: [],
  editingProject: undefined
}

export const projectSlice = createSlice({
  name: 'projectListSlice',
  initialState: initialProjectState,
  reducers: {
    openProjectModal(state) {
      // redux-toolkit 利用immer，immer底层会新建一个影子对象，并将projectModalVisible = true赋值给新的影子对象上，
      // react进行比较，得到不想等，进行从新渲染
      state.projectModalVisible = true
    },
    closeProjectModal(state) {
      state.projectModalVisible = false
    },

    setProjectList(state, action) {
      state.projectList = action.payload
    },
    updateProjectList: (state, action) => {
      const index = state.projectList.findIndex((ele) => ele.id === action.payload.id)
      if (index !== -1) {
        state.projectList[index] = action.payload
      }
    },
    addProject: (state, action) => {
      state.projectList.push(action.payload)
    },
    deleteProject: (state, action) => {
      const projectId = action.payload.id
      const targetIndex = state.projectList.findIndex((item) => item.id === projectId)
      if (targetIndex !== -1) {
        state.projectList.splice(targetIndex, 1)
      }
    },
    setEditingProject(state, action) {
      state.editingProject = action.payload
    }
  }
})
export const projectActions = projectSlice.actions

export const selectProjectModalVisible = (state: RootState) => {
  return state.project.projectModalVisible
}

export const selectPinnedProjectList = (state: RootState) => {
  return state.project.projectList.filter((ele) => ele.pin === 1)
}

export const selectProjectList = (state: RootState) => {
  return state.project.projectList
}

export const selectEditingProject = (state: RootState) => {
  return state.project.editingProject
}
