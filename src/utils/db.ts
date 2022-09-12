import Dexie from 'dexie'
import { Epic, Kanban, Project, Task, TaskType, User } from '../models/models'

export class MyAppDatabase extends Dexie {
  projects!: Dexie.Table<Project, number>
  users!: Dexie.Table<User, number>
  tasks!: Dexie.Table<Task, number>
  epics!: Dexie.Table<Epic, number>
  kanbans!: Dexie.Table<Kanban, number>
  task_types!: Dexie.Table<TaskType, number>

  constructor() {
    super('kanban_db')
    this.version(1).stores({
      users: '++id, name,password,email,title,organization,token',
      projects: '++id, name,organization,person,personId,personName,pin,created',
      tasks: '++id, name,projectId,personId,epicId,kanbanId,typeId',
      epics: '++id, name,projectId,start,end',
      kanbans: '++id, name,projectId',
      task_types: '++id, name'
    })
  }
}

export const db = new MyAppDatabase()
