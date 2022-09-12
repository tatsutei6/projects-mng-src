import { Project } from '../../models/models'
import { Button, Divider, Popconfirm, Table } from 'antd'
import dayjs from 'dayjs'
import { Pin } from '../Others/Pin'
import { useProjectModal } from '../../hooks/project'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { projectActions, selectProjectList } from '../../store/project.slice'
import commonStyles from '../../utils/Common.module.scss'
import { ErrorBox } from '../Others/Others'
import { useAppDispatch } from '../../store'
import { Dao } from '../../dao/dao'
import { Link } from 'react-router-dom'
import ProjectSearch from '../ProjectSearch/ProjectSearch'
import { CONSTANTS } from '../../utils/utils'

/**
 * ProjectListコンポーネント
 * @constructor
 */
const ProjectList = () => {
  // Projectをupdateするメゾット
  // ReduxからprojectListをロードする
  const tempData: Project[] = useSelector(selectProjectList)
  const projectList: Project[] = useSelector(selectProjectList)

  // const [projectList, setProjectList] = useState<Project[]>([])
  // Projectを作成や編集するModalを開くメゾット
  const { modalOpen } = useProjectModal()
  // Redux用
  const dispatch = useAppDispatch()
  // ProjectListコンポーネントのエラー
  const [projectListError, setProjectListError] = useState<Error | undefined>(undefined)

  const dao = Dao.getInstance()

  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   const timeout=setTimeout(() => {
  //     // setProjectList(tempData)
  //     setLoading(false)
  //   }, CONSTANTS.LOADING_DELAY_MS)
  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [tempData])


  // お気に入り(星)をクリックする処理
  const handleCheckedChange = useCallback(
    (project: Project, checked: boolean) => {
      // DBの該当データを更新する
      const param = { ...project, pin: Number(checked) }
      // projectを更新する
      dao.updateProject(param.id, param).then(
        (value) => {
          if (value) {
            // 更新したprojectをReduxに送る
            dispatch(projectActions.updateProjectList(param))
            // DBのデータ更新成功する場合、ProjectListErrorをundefinedにする
            // 前回に発生したProjectListErrorをクリアする
            setProjectListError(undefined)
          } else {
            // DBのデータ更新の時、ProjectListErrorを発生したエラーにする
            setProjectListError(new Error('データ更新に失敗しました'))
          }
        },
        // projectを更新する時、エラーを発生する
        (reason) => {
          // DBのデータ更新の時、ProjectListErrorを発生したエラーにする
          setProjectListError(new Error(reason))
        }
      )
    },
    [dao, dispatch]
  )

  // 編集ボタンをクリックする処理
  const handleEditBtn = useCallback(
    (project: Project) => {
      // 編集しようとするProjectをReduxに送る
      dispatch(projectActions.setEditingProject(project))
      // 編集modalを開く
      modalOpen()
    },
    [modalOpen, dispatch]
  )


  // 削除確認ボタンをクリックする処理
  const confirmDelete = useCallback(
    (toDeleteProject: Project) => {
      if (toDeleteProject) {
        // Reduxから該当Projectを削除
        dispatch(projectActions.deleteProject(toDeleteProject))
        dao.deleteProject(toDeleteProject.id).catch(reason => {
          setProjectListError(new Error(reason))
        })
      }
    },
    [dispatch, dao]
  )

  // Projectを格納するTableのコラム
  const columns = useMemo(() => {
    return [
      // お気に入り
      {
        title: <Pin checked={true} disabled={true}></Pin>,
        render(value: boolean, project: Project) {
          return (
            <Pin
              checked={Boolean(project.pin)}
              onCheckedChange={(value) => {
                handleCheckedChange(project, value)
              }}
            ></Pin>
          )
        }
      },
      // プロジェクトの名前
      {
        title: '名前',
        dataIndex: 'name',
        key: 'name',
        render(value: string, project: Project) {
          return <Link to={'project/' + String(project.id)}>{project.name}</Link>
        },
        sorter: (a: Project, b: Project) => a.name.localeCompare(b.name)
      },
      // プロジェクトの担当者
      {
        title: '担当者',
        dataIndex: 'personName',
        key: 'personName',
        sorter: (a: Project, b: Project) => a.personName.localeCompare(b.personName)
      },
      // プロジェクトの担当者の所属
      {
        title: '所属',
        dataIndex: 'organization',
        key: 'organization'
      },
      // プロジェクトの作成時間
      {
        title: '作成時間',
        dataIndex: 'created',
        key: 'created',
        render(val: any, ele: Project) {
          return (
            <span>
              {ele.created ? dayjs(ele.created).format('YYYY-MM-DD HH:MM') : '指定無し'}
            </span>
          )
        },
        sorter: (a: Project, b: Project) => a.created - b.created
      },
      // プロジェクトの操作ボタン
      {
        title: '操作',
        dataIndex: 'action',
        render(value: any, project: Project) {
          return (
            <Fragment>
              {/*プロジェクト編集*/}
              <Button
                className={commonStyles['btn-no-padding']}
                onClick={() => handleEditBtn(project)}
                type={'link'}
              >
                編集
              </Button>
              <Divider type={'vertical'}></Divider>
              {/*プロジェクト削除*/}
              <Popconfirm
                placement='topRight'
                title='削除しますか'
                onConfirm={() => confirmDelete(project)}
                okText='はい'
                cancelText='いいえ'
              >
                <a href='/#' className={commonStyles['a-delete']}>
                  削除
                </a>
              </Popconfirm>
            </Fragment>
          )
        }
      }
    ]
  }, [handleCheckedChange, handleEditBtn, confirmDelete])

  return (
    <div>
      <ProjectSearch setLoading={setLoading}/>
      {projectListError && <ErrorBox error={projectListError}></ErrorBox>}
      <Table
        loading={loading}
        columns={columns}
        dataSource={projectList}
        rowKey={(record) => record.id}
      ></Table>
    </div>
  )
}

export default ProjectList
