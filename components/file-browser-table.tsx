import React from 'react'
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { DateTime } from 'luxon'
import { EntryType, FileBrowserEntry, FileTableMeta, OnEntryClickFn } from '../lib/types';
import Table from './table';
import { FolderIcon, DocumentTextIcon } from '@heroicons/react/outline'

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
              <span className="align-middle">{info.getValue()}</span>
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
    case 'file': return <DocumentTextIcon className="h-5 w-5 inline-block mr-1" />
    case 'directory': return <FolderIcon className="h-5 w-5 inline-block mr-1" />
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

  return (<Table table={table} />);
};

export default FileBrowserTable;
