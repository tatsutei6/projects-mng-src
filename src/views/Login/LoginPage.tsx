import { Form, Input, Button, Card, Divider } from 'antd'
import styles from './LoginPage.module.scss'
import { useAuth } from '../../context/AuthContext'
import React, { useEffect, useState } from 'react'
import { ErrorBox, FullPageLoading } from '../../components/Others/Others'

/**
 * ログイン画面
 * @constructor
 */
export const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  // ログインメゾット
  const { login } = useAuth()
  //　ログイン画面のエラー
  const [loginError, setLoginError] = useState<Error | undefined>(undefined)
  let timer: number | undefined = undefined
  // ログインボタンをクリックする処理
  const handleLogin = (form: { name: string; password: string }) => {
    login(form, setLoading).then(
      (value) => {
        // ログイン成功、ログイン画面のエラーをundefinedにする
        setLoginError(undefined)
        timer = value.timer
      },
      // ログインの時、エラーを発生した
      (reason) => {
        setLoginError(new Error(reason.msg))
      }
    )
  }
  // unmount時にタイマーをクリアする
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  // ログイン失敗
  const onFinishFailed = (errorInfo: any) => {
    setLoginError(new Error(errorInfo))
  }

  return (
    loading ? <FullPageLoading /> :
      <div className={styles['login-container']}>
        <div className={styles['login-header']} />
        <div className={styles['login-background']} />
        <Card className={styles['login-card']}>
          <Form onFinish={handleLogin} onFinishFailed={onFinishFailed} initialValues={{ remember: true }}
                autoComplete='off'>
            {loginError && <ErrorBox error={loginError} />}
            <Form.Item
              name={'name'}
              rules={[{ required: true, message: 'ユーザー名は空です' }]}
            >
              <Input placeholder={'ユーザー名'} type='text' id={'name'} />
            </Form.Item>
            <Form.Item
              name={'password'}
              rules={[{ required: true, message: 'パスワードは空です' }]}
            >
              <Input placeholder={'パスワード'} type='password' id={'password'} />
            </Form.Item>
            <Form.Item style={{ marginTop: '10px', textAlign: 'center' }}>
              <Button
                className={styles['login-btn']}
                htmlType={'submit'}
                type={'primary'}
              >
                ログイン
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <div className={styles['login-copyright']}>Copyright © local.dev</div>
        </Card>
      </div>
  )
}
