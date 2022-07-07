export type EntryType = 'file' | 'directory'

export type FileBrowserEntry = {
  name: string
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
  data: string
}

export type FileBrowserMessage =
  | FileBrowserReadyMessage
  | FileBrowserCwdMessage
  | FileBrowserReadDirectoryMessage
  | FileBrowserReadFileMessage
export type FileBrowserMessageEvent = MessageEvent<FileBrowserMessage>

export type FileBrowserFile = string

export type FileBrowserReadFileCommand = {
  command: 'getFile'
  fileName: string
}

export type FileBrowserCommand =
  | FileBrowserReadFileCommand
export type FileBrowserCommandEvent = MessageEvent<FileBrowserCommand>
