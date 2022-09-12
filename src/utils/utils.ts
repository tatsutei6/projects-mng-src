import { useEffect, useState } from 'react'
import { Kanban, Project, Task, User } from '../models/models'
import { db } from './db'

/**
 *
 */
export const CONSTANTS = {
  DEBOUNCED_MS: 1500,
  LOADING_DELAY_MS: 1500,
}
/**
 * 有効な数字かどうか判断する
 * @param val
 */
export const isRealNum = (val: any) => {
  if (val === '' || val == null) {
    return false
  }
  return !isNaN(val)
}

/**
 * Falseかどうか判断する
 * Falseならtrue、0ならfalse
 * @param value
 */
export const isFalsy = (value: unknown) => {
  return value === 0 ? false : !value
}

/**
 * undefined、null、""かどうか判断する
 * @param value
 */
export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === ''

// object类型包括：{'a':1}这种键值对对象，也包括 ()=>{}这种函数
// {...()=>{}} 解构一个函数是没有意义的，所以我们会得到一个空对象{}
// :{ [key: string]: unknown }必须为{'a':1}这种键值对对象
/**
 * 値はundefined、null、""　だという属性をobjectから削除する
 * @param object
 */
export const cleanObject = (object: { [key: string]: unknown }) => {
  if (!object) {
    return {}
  }
  const result = { ...object }
  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (isVoid(value)) {
      delete result[key]
    }
  })
  return result
}

/**
 * コンポーネントをマウントする時、実行する
 * @param callback
 */
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback()
    // 依赖项里加入callback，会造成无限循环，这与useCallback，useMemo有关系
    // eslint-disable-next-line
  }, [])
}

/**
 * useDebounceカスタムフック
 * @param val
 * @param delay
 */
export const useDebounce = <T>(val: T, delay?: number) => {
  const [debouncedVal, setDebouncedVal] = useState(val)
  // useEffect()的作用就是指定一个副效应函数，组件每渲染一次，该函数就自动执行一次

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedVal(val), delay)
    // 每次在上一次useEffect处理完后运行return返回的函数
    // React 会在组件卸载的时候执行清除操作。正如之前学到的，effect 在每次渲染的时候都会执行。
    // 这就是为什么 React 会在执行当前 effect 之前对上一个 effect 进行清除
    return () => clearTimeout(timeout)
  }, [val, delay])
  return debouncedVal
}

const DEFAULT_USER_DATA: User[] = [
  {
    id: 1,
    name: 'Jack',
    password: '123456',
    email: 'jack@local.dev',
    title: 'developer',
    organization: 'engineering',
    token: ''
  },
  {
    id: 2,
    name: 'Jackson',
    password: '123456',
    email: 'jackson@local.dev',
    title: 'manager',
    organization: 'engineering',
    token: ''
  },
  {
    id: 3,
    name: 'John',
    password: '123456',
    email: 'john@local.dev',
    title: 'developer',
    organization: 'engineering',
    token: ''
  }
]
const DEFAULT_PROJECT_DATA: Project[] = [
  {
    id: 1,
    name: 'map feature',
    organization: 'engineering',
    person: '1,Jack',
    personId: 1,
    personName: 'Jack',
    pin: 1,
    created: 1654236441285
  },
  {
    id: 2,
    name: 'delivery app',
    organization: 'engineering',
    person: '1,Jack',
    personId: 1,
    personName: 'Jack',
    pin: 1,
    created: 1653112478739
  },
  {
    id: 3,
    name: 'backend feature',
    organization: 'engineering',
    person: '2,Jackson',
    personId: 2,
    personName: 'Jackson',
    pin: 0,
    created: 1653143441655
  },
  {
    id: 4,
    name: 'frontend feature',
    organization: 'engineering',
    person: '3,John',
    personId: 3,
    personName: 'John',
    pin: 1,
    created: 1654229702865
  },
  {
    id: 5,
    name: 'UI Design',
    organization: 'engineering',
    person: '3,John',
    personId: 3,
    personName: 'John',
    pin: 0,
    created: 1654236796856
  },
  {
    id: 6,
    name: 'Bug Fix',
    organization: 'engineering',
    person: '2,Jackson',
    personId: 2,
    personName: 'Jackson',
    pin: 1,
    created: 1655192949852
  }
]
const DEFAULT_KANBAN_DATA: Kanban[] = [{
  id: 1,
  projectId: 1,
  name: '進行中'
}, {
  id: 2,
  projectId: 1,
  name: '終了'
}, {
  id: 3,
  projectId: 1,
  name: '未着手'
}]

const DEFAULT_TASK_DATA: Task[] = [{
  id: 1,
  projectId: 1,
  name: 'タスク1',
  kanbanId: 1,
  note: 'タスク1の説明',
  typeId: 1,
  personId: 1,
  epicId: 1
}, {
  id: 2,
  projectId: 1,
  name: 'バグ改修2',
  kanbanId: 1,
  note: 'バグ改修2の説明',
  typeId: 2,
  personId: 1,
  epicId: 1
}, {
  id: 3,
  projectId: 1,
  name: 'タスク3',
  kanbanId: 2,
  note: 'タスク3の説明',
  typeId: 1,
  personId: 1,
  epicId: 1
}, {
  id: 4,
  projectId: 1,
  name: 'バグ改修4',
  kanbanId: 2,
  note: 'バグ改修4の説明',
  typeId: 2,
  personId: 1,
  epicId: 1
}, {
  id: 5,
  projectId: 1,
  name: 'タスク5',
  kanbanId: 3,
  note: 'タスク5の説明',
  typeId: 1,
  personId: 1,
  epicId: 1
}, {
  id: 6,
  projectId: 1,
  name: 'バグ改修6',
  kanbanId: 3,
  note: 'バグ改修6の説明',
  typeId: 2,
  personId: 1,
  epicId: 1
}]

/**
 * IndexedDBのデータの初期化
 */
export const initDB = async () => {
  await db.open()
  console.log('db open success')
  const val1 = await db.users.toArray()
  if (val1.length === 0) {
    await db.users.bulkAdd(DEFAULT_USER_DATA)
    console.log('init users')
  }
  const val2 = await db.projects.toArray()
  if (val2.length === 0) {
    await db.projects.bulkAdd(DEFAULT_PROJECT_DATA)
    console.log('init projects')
  }
  const val3 = await db.kanbans.toArray()
  if (val3.length === 0) {
    await db.kanbans.bulkAdd(DEFAULT_KANBAN_DATA)
    console.log('init kanbans')
  }

  const val4 = await db.tasks.toArray()
  if (val4.length === 0) {
    await db.tasks.bulkAdd(DEFAULT_TASK_DATA)
    console.log('init tasks')
  }
}
