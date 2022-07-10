export type EntryType = 'file' | 'directory'

export type FileBrowserEntry = {
  name: string
  relativePath: string
  type: EntryType
  message: string
  modified: number // milliseconds since epoch (Date does not serialize correctly)
}

export type Author = {
  name: string
  email: string
}

export type CommitSummary = {
  id: string
  shortId: string
  author: Author
  message: string
  messageFull: string
  date: number // milliseconds since epoch (Date does not serialize correctly)
}

export type OnEntryClickFn = (entry :FileBrowserEntry) => void
export type FileTableMeta = {
  onEntryClick?: OnEntryClickFn
}

export type FileBrowserReadyMessage = {
  command: 'ready'
}

export type FileBrowserCwdMessage = {
  command: 'cwd'
  data: string
}

export type FileBrowserReadDirectoryMessage = {
  command: 'readdir'
  data: FileBrowserEntry[]
}

export type FileBrowserReadFileMessage = {
  command: 'readfile'
  fileName: string
  data: {
    commit: CommitSummary,
    contents: string
  }
}

export type FileBrowserMessage =
  | FileBrowserReadyMessage
  | FileBrowserCwdMessage
  | FileBrowserReadDirectoryMessage
  | FileBrowserReadFileMessage
export type FileBrowserMessageEvent = MessageEvent<FileBrowserMessage>

export type FileBrowserFile = string

export type FileBrowserGetFileCommand = {
  command: 'getFile'
  fileName: string
}

export type FileBrowserGetDirCommand = {
  command: 'getDir'
  dirName: string
}

export type FileBrowserCommand =
  | FileBrowserGetFileCommand
  | FileBrowserGetDirCommand
export type FileBrowserCommandEvent = MessageEvent<FileBrowserCommand>
