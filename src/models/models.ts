/**
 * LoginForm
 */
export interface LoginForm {
  name: string,
  password: string
}

/**
 * User
 */
export interface User {
  id: string | number
  name: string
  password: string
  email: string
  // 役職
  title: string
  // 所属
  organization: string,
  token: string
}

/**
 * ProjectList
 */
export interface Project {
  id: string | number;
  name: string;
  personId: string | number;
  personName: string;
  //　お気に入りかどうか
  pin: number;
  organization: string;
  created: number;
  // ProjectModalの「担当者」項目のために使う
  // フォーマット：1,Jack
  person?: string
}

export interface Task {
  id?: number|string;
  name: string;
  // 担当者
  personId: number|string;
  projectId: number|string;
  // タスクグループ
  epicId: number|string;
  kanbanId: number|string;
  // タスクの種類：bug or task
  typeId: number|string;
  note?: string;
}

export interface Epic {
  id: number;
  name: string;
  projectId: number;
  // 開始時間
  start: number;
  // 終了時間
  end: number;
}

export interface Kanban {
  id?: number;
  name: string;
  projectId: number;
}

export interface TaskType {
  id: number;
  name: string;
}



