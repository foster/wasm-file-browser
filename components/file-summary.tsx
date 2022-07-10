import React from 'react'
import { UserCircleIcon, UsersIcon } from '@heroicons/react/outline'
import { CommitSummary } from '../lib/types';
import { DateTime } from 'luxon';

type FileSummaryProps = {
  commit: CommitSummary;
}
const FileSummary: React.FC<FileSummaryProps> = ({commit}) => {
  const commitDateHuman = DateTime.fromMillis(commit.date).toRelative()
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <div className="divide-y divide-gray-300">
        <div className="box-header bg-gray-50 px-3 py-3.5 text-left text-sm text-gray-500">
          <div className="flex">
            <div className="grow">  {/* stuff on the left */}
              <UserCircleIcon className="h-5 w-5 inline-block mr-1 -mt-1" />
              <span className="mr-3 text-gray-900 font-semibold">{commit.author.name}</span>
              <span className="">{commit.message}</span>
            </div>
            <div className="justify-end">  {/* stuff on the right */}
              <span className="pr-1">Latest commit</span>
              <span className="text-xs font-mono">{commit.shortId}</span>
              <span className="pl-3">{commitDateHuman}</span>
            </div>
          </div>
        </div>
        <div className="px-3 py-4">
          <UsersIcon className="h-5 w-5 inline-block mr-1" />
          <span className="pr-3 align-middle">1 contributor</span>
        </div>
      </div>
    </div>
  )
}

export default FileSummary;
