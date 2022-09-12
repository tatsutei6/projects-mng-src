import React, { Dispatch, ReactNode, useContext, useState } from 'react'
import { LoginForm, User } from '../models/models'
import { CONSTANTS, useMount } from '../utils/utils'
import { userActions } from '../store/user.slice'
import { useAppDispatch } from '../store'
import { Dao } from '../dao/dao'

// DataAccessObject
const dao = Dao.getInstance()


/**
 * ユーザー認証Context
 */
const AuthContext = React.createContext<{
  user: User | null,
  login: (form: LoginForm, setLoading: Dispatch<React.SetStateAction<boolean>>) => Promise<any>,
  logout: () => Promise<string>,
  initUserListInRedux: () => void
} | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

// JWT TokenのlocalStorageのkey
export const localStorageTokenKey = '_auth_provider_user_token_'
// json化したUserのlocalStorageのkey
export const localStorageUserObjKey = '_auth_provider_user_obj_'

/**
 * localStorageからTokenを読み取る
 */
const getToken = () => {
  return window.localStorage.getItem(localStorageTokenKey)
}

/**
 * localStorageにあるToken(JWT)を検証し、Userへ転換する
 */
const loadUserInfo = async () => {
  let user = null
  // localStorageからJWT Tokenを取得
  const token = getToken()
  // JWT Tokenを検証する
  if (token) {
    user = await dao.me(token)
  }
  return user
}

/**
 * JWTを生成する
 * @param user
 * @param KJUR
 */
function generateJwt(user: User, KJUR: any) {
  // JWTのヘッダー
  const header = {
    'typ': 'JWT', // タイプ
    'alg': 'HS256' // JWTに署名する(sign)ために使用するアルゴリズム
  }

  // UTC(世界協定時 - 1970年1月1日 0時0分0秒)からの経過時間をミリ秒
  const iatTime = Date.now()
  // JWTのpayload
  const payload = {
    'sub': 'kanban jwt',
    'iss': 'kanban.local.dev',
    'aud': 'local.dev',
    'id': user.id,
    'name': user.name,
    'iat': iatTime,
    'exp': iatTime + (7 * 86400 * 1000)　//　有効期間は7日
  }
  // headerをjson化
  const sHeader = JSON.stringify(header)
  // payloadをjson化
  const sPayload = JSON.stringify(payload)
  // JWTを生成する
  return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: 'kanban' })
}

/**
 * Providerコンポーネント
 * @param children
 * @constructor
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ログインしたuser情報
  const [user, setUser] = useState<User | null>(null)
  // Redux用
  const dispatch = useAppDispatch()

  /**
   *  ページをマウントする時、ログイン情報をロードする
   */
  useMount(() => {
    console.log('AuthProvider useMount')
    initUserListInRedux()
    loadUserInfo().then(setUser)
  })

  const initUserListInRedux = () => {
    console.log('AuthProvider initUserListInRedux')
    dao.getAllUsers().then(value => {
      // DBから取得してきたuserをReduxに送る
      dispatch(userActions.setUserList(value))
    })
  }


  /**
   * ログイン処理
   * @param form
   * @param setLoading
   */
  const login = (form: LoginForm, setLoading: Dispatch<React.SetStateAction<boolean>>) => {
    return new Promise<any>((resolve, reject) => {
      // userをDBから取得
      dao.getUserByName(form.name).then((value) => {
          if (!value) {
            // user名は存在なしで、ログイン失敗
            reject({ msg: 'ユーザーは存在なし' })
          } else if (value.password === form.password) {
            // user名とパスワードが一致する場合、ログイン成功
            setLoading(true)
            // JWTを生成する
            const KJUR = require('jsrsasign')
            const sJWT = generateJwt(value, KJUR)
            // JWT TokenをlocalStorageに保存する
            window.localStorage.setItem(localStorageTokenKey, value.token || sJWT)
            // userをjson化、localStorageに保存する
            window.localStorage.setItem(localStorageUserObjKey, JSON.stringify(value))
            // user名とパスワードが一致で、ログインsuccess
            // loadingの効果を見せるために、1.5秒待つ
            const timer=setTimeout(() => {
              setUser(value)
              setLoading(false)
            }, CONSTANTS.LOADING_DELAY_MS)
            resolve({msg:'ユーザーとパスワードが一致',timer})
          } else {
            // user名とパスワードが不一致で、ログインfail
            reject('ユーザーとパスワードが不一致')
          }
        }, () => {
          reject({ msg: 'DBエラーが発生' })
        } // userをDBから取得する時、エラー発生
      )
    })
  }

  /**
   * ログアウト処理
   */
  const logout = () => {
    return new Promise<string>((resolve, _) => {
      // userをnullにする
      setUser(null)
      resolve('logout success')
    })
  }

  return <AuthContext.Provider value={{ user, login, logout, initUserListInRedux }}>{children}</AuthContext.Provider>
}

/**
 * contextを返す
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthはAppProvidersの範囲内で利用する必要がある')
  }
  return context
}
