import React from 'react'
import filesize from 'filesize'

type FileContentsProps = {
  // commit: CommitSummary;
  contents: string;
}
const FileContents: React.FC<FileContentsProps> = ({contents}) => {
  const lineCount = getLineCount(contents)
  const fileSizeRaw = new TextEncoder().encode(contents).length
  const fileSize = filesize(fileSizeRaw, {standard: 'jedec', base: 2})

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <div className="divide-y divide-gray-300">
        <div className="box-header bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 divide-x-2 divide-gray-300">
          <span className="pr-3">{lineCount} lines</span>
          <span className="pl-3">{ fileSize }</span>
        </div>
        <div className="px-3 py-4">
          <pre className="overflow-y-auto">{contents}</pre>
        </div>
      </div>
    </div>
  )
}

export default FileContents;

function getLineCount(contents: string): number {
  return Array.from(contents).reduce((acc, chr) => (chr === '\n') ? acc+1 : acc, 0);
}
