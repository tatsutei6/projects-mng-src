import React from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import styles from './ProjectPage.module.scss'

import KanbanPage from '../Kanban/KanbanPage'
import { Menu } from 'antd'

const useComponentName = () => {
  const units = useLocation().pathname.split('/')
  return units[units.length - 1]
}

const ProjectPage = () => {
  // get id from url
  let { id } = useParams()
  if (id === undefined) {
    id = '1'
  }
  const getPath = () => {
    return '/projects-mng/project/' + id
  }

  return (
      <div className={styles['project-container']}>
        <div className={styles['project-aside']}>
          <Menu mode={'inline'} selectedKeys={[useComponentName()]}>
            <Menu.Item key={'kanban'}>
              <Link to={'kanban'}>看板</Link><br />
            </Menu.Item>
          </Menu>
        </div>
        <div className={styles['project-main']}>
          <Routes>
            <Route
              path={'/kanban'}
              element={<KanbanPage projectId={id} />}
            />
            <Route path='*' element={<Navigate to={getPath() + '/kanban'} replace />} />
          </Routes>
        </div>
      </div>
  )
}

export default ProjectPage