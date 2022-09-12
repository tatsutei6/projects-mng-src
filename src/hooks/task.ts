import { useCallback } from 'react'
import { useAppDispatch } from '../store'
import { taskActions } from '../store/task.slice'

export const useTasksModal = () => {

  // Redux用
  const dispatch = useAppDispatch()
  /**
   * projectModalを開く
   */
  const modalOpen = useCallback(() => {
    dispatch(taskActions.openTaskModal())
  }, [dispatch])

  /**
   * projectModalを閉じる
   */
  const modalClose = useCallback(() => {
    dispatch(taskActions.closeTaskModal())
  }, [dispatch])

  return {
    modalOpen,
    modalClose
  }
}
