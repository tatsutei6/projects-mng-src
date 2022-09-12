import { createSlice } from '@reduxjs/toolkit'
import { User } from '../models/models'
import { RootState } from '.'

interface UserState {
  userList: User[]
}


const initialUserState: UserState = {
  userList: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    addUser(state, action) {
      state.userList.push(action.payload)
    },
    setUserList(state, action) {
      state.userList = action.payload
    }
  }
})

export const userActions = userSlice.actions

export const selectUserList = (state: RootState) => {
  return state.user.userList
}