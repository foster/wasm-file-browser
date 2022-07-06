export type EntryType = 'file' | 'directory'

export type FileBrowserEntry = {
  name: string
  type: EntryType
  message: string
  modified: number // milliseconds since epoch (Date does not serialize correctly)
}
