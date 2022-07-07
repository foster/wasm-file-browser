import React from 'react'
import filesize from 'filesize'

type FileViewProps = {
  // commit: CommitSummary;
  contents: string;
}
const FileView: React.FC<FileViewProps> = ({contents}) => {
  const lineCount = getLineCount(contents)
  const fileSizeRaw = new TextEncoder().encode(contents).length
  const fileSize = filesize(fileSizeRaw, {standard: 'jedec', base: 2})

  return (
    <div className="divide-y divide-gray-300">
      <div className="box-header bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 divide-x-2 divide-gray-300">
        <span className="pr-3">{lineCount} lines</span>
        <span className="pl-3">{ fileSize }</span>
      </div>
      <div className="px-3 py-4">
        <pre className="overflow-y-auto">{contents}</pre>
      </div>
    </div>
  )
}

export default FileView;

function getLineCount(contents: string): number {
  return Array.from(contents).reduce((acc, chr) => (chr === '\n') ? acc+1 : acc, 0);
}
