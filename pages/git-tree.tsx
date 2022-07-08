import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useState } from 'react'
import FileBrowserTable from '../components/file-browser-table'
import GitPageLayout from '../components/git-page-layout';
import { FileBrowserEntry, FileBrowserMessage } from '../lib/types';
import useWorker from '../lib/use-worker';

const GitTreePage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ state, setState ] = useState<FileBrowserEntry[]>([]);
  const router = useRouter()

  // instantiate webworker and set up message listener
  useWorker((msg: FileBrowserMessage) => {
    switch (msg.command) {
      case 'ready':
        setLoaded(true);
        break;
      case 'cwd':
        break;
      case 'readdir':
        setState(msg.data);
        break;
      default:
        console.log(`Unexpected message: $msg`)
    }
  })

  const onEntryClick = (entry: FileBrowserEntry) => {
    switch (entry.type) {
      case 'directory': {
        const href = `github/foster/wasm-file-browser/tree/${entry.name}`
        router.push(href)
        break
      }
      case 'file': {
        const href = `github/foster/wasm-file-browser/blob/${entry.name}`
        router.push(href)
        break
      }
    }
  };

  if (isLoaded) {
    return (
      <GitPageLayout>
        <FileBrowserTable data={state} onEntryClick={onEntryClick} />
      </GitPageLayout>
    )
  } else {
    return (<div>Loading...</div>)
  }
}

export default GitTreePage
