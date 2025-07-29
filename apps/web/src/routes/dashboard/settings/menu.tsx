// @GEMINI 注释的组件是用来告诉你有哪些可以用的
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ago/ui/basic/table.tsx'
import { createFileRoute } from '@tanstack/react-router'
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from '@tanstack/react-table'

export const Route = createFileRoute('/dashboard/settings/menu')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/settings/menu"!</div>
}
