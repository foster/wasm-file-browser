export type EntryType = 'file' | 'directory'

export type FileBrowserEntry = {
  name: string;
  type: EntryType;
  message: string;
  modified: number; // milliseconds since epoch (Date does not serialize correctly)
}

export type Author = {
  name: string;
  email: string;
}

export type CommitSummary = {
  id: string;
  shortId: string;
  author: Author;
  message: string;
  messageFull: string;
}

export type OnEntryClickFn = (entry :FileBrowserEntry) => void
export type FileTableMeta = {
  onEntryClick?: OnEntryClickFn
}
