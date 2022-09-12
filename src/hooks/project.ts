import { useCallback } from 'react'
import { projectActions } from '../store/project.slice'
import { useAppDispatch } from '../store'

/**
 * projectModalのhooks
 */
export const useProjectModal = () => {
  // Redux用
  const dispatch = useAppDispatch()
  /**
   * projectModalを開く
   */
  const modalOpen = useCallback(() => {
    dispatch(projectActions.openProjectModal())
  }, [dispatch])

  /**
   * projectModalを閉じる
   */
  const modalClose = useCallback(() => {
    dispatch(projectActions.closeProjectModal())
    dispatch(projectActions.setEditingProject(undefined))
  }, [dispatch])

  return {
    modalOpen,
    modalClose
  }
}
