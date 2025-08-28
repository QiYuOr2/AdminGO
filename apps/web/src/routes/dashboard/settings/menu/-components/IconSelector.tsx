import type { ComponentProps } from 'react'
import { Button, Dropdown } from 'antd'
import { useState } from 'react'
import { cn } from '~/common/utils/cn'

interface IconSelectorProps extends ComponentProps<typeof Dropdown> {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

const icons = [
  'i-fluent:border-none-24-filled',
  'i-fluent:access-time-24-filled',
  'i-fluent:add-square-24-filled',
  'i-fluent:person-24-filled',
  'i-fluent:star-24-filled',
  'i-fluent:home-24-filled',
  'i-fluent:building-retail-more-24-filled',
  'i-fluent:settings-24-filled',
]

export function IconSelector({ value, placeholder, onChange, ...rest }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const handleSelect = (icon: string) => {
    onChange?.(icon)
  }

  return (
    <Dropdown
      popupRender={() => (
        <div className="p-2 max-h-60 overflow-y-auto bg-white rounded-md shadow-[var(--ant-box-shadow-secondary)]">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${4}, minmax(0, 1fr))` }}
          >
            {icons.map(icon => (
              <div
                key={icon}
                className={cn(
                  'p-2 flex justify-center items-center border rounded cursor-pointer transition hover:border-blue-500 hover:bg-[rgba(0,0,0,0.04)]',
                  value === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
                )}
                onClick={() => handleSelect(icon)}
              >
                <i className={`${icon} text-2xl`}></i>
              </div>
            ))}
          </div>
        </div>
      )}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      {...rest}
    >
      <Button>
        {value ? <i className={`${value} text-xl`}></i> : '选择图标'}
      </Button>
    </Dropdown>
  )
}
