import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { projectSlice } from './project.slice'
import { userSlice } from './user.slice'
import { taskSlice } from './task.slice'

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const rootReducer = {
  project: projectSlice.reducer,
  user: userSlice.reducer,
  task: taskSlice.reducer,
}

export const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

// add相当于action
// add = data=>{type:'add_data', ...data}
// without redux-thunk
// loadData().then(data=>{
//    dispatch(add(data))
// })
// with redux-thunk
// const addTodoAsync = ()=>{
//    return dispatch =>{
//      loadData().then(data=>{
//          dispatch(add(data))
//      })
//    }
// }
// dispatch(addTodoAsync())