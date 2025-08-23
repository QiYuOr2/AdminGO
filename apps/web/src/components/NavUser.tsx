import type { ComponentProps } from 'react'
import { Avatar } from 'antd'
import { cn } from '~/common/utils/cn'

interface NavUserProps extends ComponentProps<'div'> {
  collapsed?: boolean
}

export function NavUser({ collapsed }: NavUserProps) {
  return (
    <div className="flex items-center justify-center p-4 gap-2">
      <Avatar shape="square" size="small" />

      {!collapsed && (
        <>
          <div className="text-xs">
            <div>User0001</div>
            <div>m@example.com</div>
          </div>
          <div className={cn(
            'ml-auto cursor-pointer py-1 rounded transition-colors duration-200',
            'hover:bg-warmGray-100',
          )}
          >
            <div
              className="i-fluent:more-vertical-24-regular text-xl"
            >
            </div>
          </div>
        </>
      )}

    </div>
  )
}
