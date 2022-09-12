import React, { useEffect, useRef, useState } from 'react'
import { CONSTANTS, useDebounce } from '../../utils/utils'
import { Form, Input, Select } from 'antd'
import { ErrorBox } from '../Others/Others'
import { useSelector } from 'react-redux'
import { selectUserList } from '../../store/user.slice'
import { projectActions } from '../../store/project.slice'
import { Dao } from '../../dao/dao'
import { useAppDispatch } from '../../store'

/**
 * project検索コンポーネント
 * @constructor
 */
const ProjectSearch = (props:{setLoading: React.Dispatch<React.SetStateAction<boolean>>}) => {
  // project検索コンポーネントのエラー
  const [projectSearchError, setProjectSearchError] = useState<Error | undefined>(undefined)
  // 検索パラメーター
  const [param, setParam] = useState<{
    projectName: string
    personId: string | number
  }>({
    projectName: '',
    personId: ''
  })
  // Reduxから全てのUserをロードする
  let userList = useSelector(selectUserList)

  const debouncedParam = useDebounce(param, CONSTANTS.DEBOUNCED_MS)
  const dao = Dao.getInstance()
  const dispatch = useAppDispatch()
  const { setLoading } = props
  // timeoutをクリアするためのref
  let timeout =useRef<NodeJS.Timeout|undefined>(undefined)

  useEffect(() => {
    (async () => {
      try { // projectを検索する
        setLoading(true)
        const projects = await dao.getProjectsByParam(debouncedParam)
        if (timeout.current) {
          clearTimeout(timeout.current)
        }
        // DBからもらったprojectをReduxに送る
        timeout.current=setTimeout(() => {
          dispatch(projectActions.setProjectList(projects))
          setLoading(false)
          setProjectSearchError(undefined)
        }, CONSTANTS.LOADING_DELAY_MS)
        // project検索成功の場合、projectSearchErrorをundefinedにする
      } catch (e: any) {
        // ReduxにあるProjectListをクリアする
        dispatch(projectActions.setProjectList([]))
        setProjectSearchError(new Error(e))
        setLoading(false)
      }
    })()
  }, [setLoading,dao, debouncedParam, dispatch])


  return (
    <Form style={{ marginBottom: '2rem' }} layout={'inline'}>
      {projectSearchError && <ErrorBox error={projectSearchError}></ErrorBox>}
      <Form.Item>
        <Input
          value={param.projectName}
          onChange={(event) =>
            setParam({ ...param, projectName: event.target.value })
          }
        />
      </Form.Item>
      <Form.Item>
        <Select
          value={param.personId}
          dropdownMatchSelectWidth={false}
          onChange={(val) => setParam({ ...param, personId: val })}
        >
          {/* 全員は個人と区別するため、keyを-1にして、valueを''にする */}
          <Select.Option key={-1} value={''}>
            {'全員'}
          </Select.Option>
          {userList.map((user) => {
            return (
              <Select.Option key={user.id} value={String(user.id)}>
                {user.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
      {/*<button onClick={handleAddBtnClick}>Add Data</button>*/}
    </Form>
  )
}

export default ProjectSearch
