import { db } from '../utils/db'
import { Project, Task, User } from '../models/models'
import { isVoid } from '../utils/utils'
import { localStorageUserObjKey } from '../context/AuthContext'

export class Dao {
  static instance: Dao

  static getInstance() {
    if (Dao.instance) return Dao.instance
    Dao.instance = new Dao()
    return Dao.instance
  }

  async updateProject(id: number | string, param: Partial<Project>) {
    return db.projects.update(Number(id), param)
  }

  async updateTask(id: number | string | undefined, param: Partial<Task>) {
    if (id !== undefined) {
      return db.tasks.update(Number(id), param)
    }
    return 0
  }

  async getProjectById(id: number | string) {
    return db.projects.get(Number(id))
  }

  async getUserById(id: number | string) {
    return db.users.get(Number(id))
  }

  async getTaskById(id: number | string | undefined) {
    if (id !== undefined) {
      return db.tasks.get(Number(id))
    }
    return undefined
  }

  async getTasksByProjectId(projectId: number | string | undefined) {
    if (projectId !== undefined) {
      return db.tasks.where('projectId').equals(Number(projectId)).toArray()
    }
    return []
  }

  async getKanbansByProjectId(projectId: number | string | undefined) {
    if (projectId !== undefined) {
      return db.kanbans.where('projectId').equals(Number(projectId)).toArray()
    }
    return []
  }

  async getTasksByKanbanId(kanbanId: number | string | undefined) {
    if (kanbanId !== undefined) {
      return db.tasks.where('kanbanId').equals(Number(kanbanId)).toArray()
    }
    return []
  }

  async getUserByName(name: string) {
    // await db.open()
    return db.users.where('name').equals(name).first()
  }

  async getAllUsers() {
    return db.users.toArray()
  }

  async getAllKanbans() {
    return db.kanbans.toArray()
  }

  async getProjectsByPersonId(personId: number | string) {
    return db.projects.where('personId').equals((Number(personId))).toArray()
  }

  async getProjectsByName(name: string) {
    const r = new RegExp(name, 'i')
    return db.projects.filter((ele) => r.test(ele.name)).toArray()
  }

  async getProjectsByParam(param: { personId: string | number; projectName: string }) {
    if (isVoid(param.personId) && isVoid(param.projectName)) {
      return this.getAllProjects()
    }
    if (isVoid(param.personId)) {
      return this.getProjectsByName(param.projectName)
    }
    if (isVoid(param.projectName)) {
      return this.getProjectsByPersonId(param.personId)
    }

    const r = new RegExp(param.projectName, 'i')

    return db.projects
      .where('personId')
      .equals(Number(param.personId))
      .filter((ele) => r.test(ele.name))
      .toArray()
  }

  async deleteProject(projectId: number | string) {
    return db.projects.delete(Number(projectId))
  }

  async deleteTask(taskId: number | string | undefined) {
    if (taskId !== undefined) {
      return db.tasks.delete(Number(taskId))
    }
  }

  async deleteTasksByKanbanId(kanbanId: number | string | undefined) {
    if (kanbanId !== undefined) {
      return db.tasks
        .where('kanbanId')
        .equals(Number(kanbanId))
        .delete()
    }
  }

  async deleteKanban(kanbanId: number | string | undefined) {
    if (kanbanId !== undefined) {
      return db.kanbans.delete(Number(kanbanId))
    }
  }

  async saveProject(param: Project) {
    return db.projects.put(param)
  }

  async saveKanban(projectId: number | string, name: string) {
    return db.kanbans.put({ projectId: Number(projectId), name: name })
  }

  async saveTask(param: Task) {
    return db.tasks.put(param)
  }

  async getAllProjects() {
    return db.projects.toArray()
  }

  me(jwtToken: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      // check if the token valid
      const KJUR = require('jsrsasign')
      const isValid = KJUR.jws.JWS.verifyJWT(
        jwtToken,
        { utf8: 'kanban' },
        { alg: ['HS256'], verifyAt: Date.now() }
      )
      if (isValid) {
        if (window.localStorage.getItem(localStorageUserObjKey)) {
          resolve(
            JSON.parse(
              window.localStorage.getItem(localStorageUserObjKey) || ''
            )
          )
        } else {
          reject('ローカルストレージにユーザーが存在しません')
        }
      } else {
        reject('JWTが無効です')
      }
    })
  }
}
