import type { MenuProps, TableColumnsType } from 'antd'
import { Dropdown } from 'antd'
import { toMap } from '~/common/utils/array'

type ElementOf<T> = T extends (infer U)[] ? U : never

type ExtendItem = ElementOf<MenuProps['items']>

type ActionsMenuItem<T> = ExtendItem & {
  key: string
  onActionClick?: (data: T) => void
}

interface ActionsMenuProps<T> {
  items: ActionsMenuItem<T>[]
  onClick?: (_: { key: string }) => void
}

export function ActionsMenu<T>({ items, onClick }: ActionsMenuProps<T>) {
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: items as unknown as MenuProps['items'],
        onClick: onClick as () => void,
      }}
    >

      <div className="flex">
        <div
          className="cursor-pointer hover:bg-warmGray-100 rounded-lg p-2"
          onClick={e => e.preventDefault()}
        >
          <div className="i-fluent:more-horizontal-32-regular text-xl"></div>
        </div>
      </div>
    </Dropdown>
  )
}

export function appendActionsMenu<T>(columns: TableColumnsType<T>, menu: ActionsMenuItem<T>[]): TableColumnsType<T> {
  const itemsMap = toMap(menu, 'key')

  const onClick = (record: T) =>
    ({ key }: { key: string }) => {
      itemsMap.get(key as keyof ActionsMenuItem<T>)?.onActionClick?.(record)
    }

  return [
    ...columns,
    {
      title: '',
      dataIndex: 'action',
      width: 80,
      render: (_, record) => <ActionsMenu items={menu} onClick={onClick(record)} />,
    },
  ]
}
