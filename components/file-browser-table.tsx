import React from 'react'
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import { EntryType, FileBrowserEntry, FileTableMeta, OnEntryClickFn } from '../lib/types';

const columns: ColumnDef<FileBrowserEntry>[] = [
  {
    header: 'Git stuff',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'name',
        cell: info => {
          const entry: FileBrowserEntry = info.row.original!;
          const meta = info.table.options.meta as FileTableMeta;
          const onEntryClick: OnEntryClickFn = meta.onEntryClick || (() => {});

          return (
            <span className="hover:underline hover:cursor-pointer" onClick={() => onEntryClick(entry)}>
              {iconFor(entry.type)}
              {info.getValue()}
            </span>
          )
        },
        // cell: info => <>{iconFor(info.row.original!.type)}  {info.getValue()}</>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'message',
      },
      {
        accessorKey: 'modified',
        cell: info => DateTime.fromMillis(info.getValue()).toRelative()
      },
    ],
  }
];

function iconFor(e: EntryType) {
  switch (e) {
    case 'file': return <span>[F]</span>
    case 'directory': return <span>[D]</span>
  }
}

export interface FileBrowserTableProps {
  data: FileBrowserEntry[]
  onEntryClick?: (e: FileBrowserEntry) => void
}
const FileBrowserTable: React.FC<FileBrowserTableProps> = ({data, onEntryClick}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onEntryClick
    }
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} colSpan={header.colSpan} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default FileBrowserTable;