import { Button, Divider, List, Popover, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { useProjectModal } from '../../hooks/project'
import { selectPinnedProjectList } from '../../store/project.slice'
import commonStyles from '../../utils/Common.module.scss'

/**
 * プロジェクトリストページのヘッダーの「プロジェクト」をhoverすると、
 * 表示するprojectポップオーバーコンポーネント
 * @constructor
 */
export const ProjectPopover = () => {
  // Project作成、編集Modalを開く
  const { modalOpen } = useProjectModal()
  // 「お気に入り」のprojectリストをReduxからロード
  const pinnedProjectList = useSelector(selectPinnedProjectList)

  const content = <div style={{ minWidth: '25rem' }}>
    <Typography.Text type={'secondary'}>お気に入り</Typography.Text>
    {/*「お気に入り」のprojectリスト*/}
    <List>
      {pinnedProjectList?.map((project) => (
        <List.Item key={project.id}>
          <List.Item.Meta title={project.name} />
        </List.Item>
      ))}
    </List>
    <Divider />
    {/* 「プロジェクトを作成するリンク */}
    <Button className={commonStyles['btn-no-padding']} type={'link'} onClick={() => {
      modalOpen()
    }}>
      プロジェクトを作成する
    </Button>
  </div>
  return <Popover placement={'bottom'} content={content}>プロジェクト
  </Popover>
}