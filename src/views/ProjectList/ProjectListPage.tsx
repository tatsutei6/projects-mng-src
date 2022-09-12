import ProjectList from '../../components/ProjectList/ProjectList'
import { localStorageTokenKey, localStorageUserObjKey, useAuth } from '../../context/AuthContext'
import styles from './ProjectListPage.module.scss'
import commonStyles from '../../utils/Common.module.scss'
import { Button, Dropdown, Menu } from 'antd'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useProjectModal } from '../../hooks/project'
import { ProjectPopover } from '../../components/ProjectPopover/ProjectPopover'
import { ProjectModal } from '../../components/ProjectModal/ProjectModal'
import { Fragment, useState } from 'react'
import { ErrorBox } from '../../components/Others/Others'
import ProjectPage from '../Project/ProjectPage'

/**
 * ログアウトヘッダーコンポーネント
 * @constructor
 */
const LogoutHeader = () => {
  const { logout, user } = useAuth()
  // ログアウトヘッダーエラー
  const [logoutHeaderError, setLogoutHeaderError] = useState<Error | undefined>(
    undefined
  )
  /**
   * ログアウトボタンの処理
   */
  const handleLogoutBtn = () => {
    logout().then(
      (_) => {
        // 成功の場合、ログアウトヘッダーエラーをundefinedにする
        setLogoutHeaderError(undefined)
        // JWT TokenをlocalStorageから削除する
        window.localStorage.removeItem(localStorageTokenKey)
        // json化されたuserをlocalStorageから削除する
        window.localStorage.removeItem(localStorageUserObjKey)
      },
      (reason) => {
        // 失敗の場合、ログアウトヘッダーエラーを設定する
        setLogoutHeaderError(new Error(reason))
      }
    )
  }
  //　ログアウトヘッダーメニュー
  const menuItems = [
    {
      key: 'logout',
      label: (
        <Button onClick={handleLogoutBtn} type={'link'}>
          ログアウト
        </Button>
      )
    }
  ]
  return (
    <Fragment>
      {logoutHeaderError && <ErrorBox error={logoutHeaderError}></ErrorBox>}
      <Dropdown overlay={<Menu items={menuItems} />}>
        <Button type={'link'} onClick={(e) => e.preventDefault()}>
          こんにちは, {user?.name}さん
        </Button>
      </Dropdown>
    </Fragment>
  )
}

/**
 * projectヘッダーコンポーネント
 * @constructor
 */
const ProjectHeader = () => {
  // projectModalを開くメゾット
  const { modalOpen } = useProjectModal()
  return (
    <header className={styles['project-list-header']}>
      {/*ヘッダーの左部分*/}
      <div className={`${commonStyles['common-row']} ${styles['project-list-row']}`}>
        <Button
          className={commonStyles['btn-no-padding']}
          type={'link'}
          style={{ fontSize: '1.5rem' }}
          onClick={() => {
            window.location.href = '/projects-mng'
          }}
        >
          ホーム
        </Button>
        <Button
          type={'link'}
          onClick={() => {
            modalOpen()
          }}
        >
          プロジェクトを作成する
        </Button>
        <ProjectPopover />
      </div>
      {/*ヘッダーの右部分*/}
      <div>
        <LogoutHeader />
      </div>
    </header>
  )
}

/**
 * projectページコンポーネント
 * @constructor
 */
const ProjectListPage = () => {
  return (
    <div className={styles['project-list-container']}>
      <BrowserRouter>
        <ProjectHeader />
        <main className={styles['project-list-main']}>
          <Routes>
            <Route
              path={'/projects-mng'}
              element={<ProjectList />}
            />
            <Route
              path={'/projects-mng/project/:id/*'}
              element={<ProjectPage />}
            />

            {/*そのほかのUrl、/projectsへダイレクトする*/}
            <Route path='*' element={<Navigate to='/projects-mng' />} />
          </Routes>
          {/* 変数（Reduxに保存する）projectModalVisibleを通じて、
          ProjectModalを表示させるかコントロールする */}
          <ProjectModal />
        </main>
      </BrowserRouter>
    </div>
  )
}

export default ProjectListPage
