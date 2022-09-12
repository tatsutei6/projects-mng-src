import React from 'react'
import { Rate } from 'antd'

interface PinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}

/**
 * お気に入りコンポーネント
 * antdのRateを利用する
 * @param checked
 * @param onCheckedChange
 * @param restProps
 * @constructor
 */
export const Pin = ({ checked, onCheckedChange, ...restProps }: PinProps) => {
  return (
    <Rate
      count={1}
      value={Number(checked)}
      onChange={(value) => onCheckedChange?.(Boolean(value))}
      {...restProps}
    />
  )
}
