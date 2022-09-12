import { message, Spin, Typography } from 'antd'
import styles from './Others.module.scss'

export const FullPageLoading = () => (
  <div className={styles["full-page"]}>
    <Spin size={"large"} />
  </div>
);
/**
 * エラー情報ページ
 * react-error-boundaryライブラリーと一緒に使う
 * @param error
 * @constructor
 */
export const FullPageErrorFallback = ({ error }: { error: Error | null }) => (
  <div className={`${styles['full-page']} ${styles['large-font']}`}>
    <Typography.Text type={'danger'}>
      {error?.message ? error?.message : 'Unknown Error'}
      <br />
      <a href={'/projects-mng'}>ホームへ</a>
    </Typography.Text>
  </div>
)

/**
 * Errorかどうかチェック
 * @param value
 */
const isError = (value: any): value is Error => value?.message

/**
 * antdのMessageを通じ、エラー情報を表示する
 * @param error
 */
export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    message.error(error?.message)
  }
  return null
}
