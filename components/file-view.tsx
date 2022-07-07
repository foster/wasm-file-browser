import React from 'react'
import { deflate } from 'zlib';

type FileViewProps = {
  // commit: CommitSummary;
  contents: string;
}
const FileView: React.FC<FileViewProps> = ({contents}) => (
  <pre>{contents}</pre>
)

export default FileView;
