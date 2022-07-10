import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import FileBrowserTable from '../components/file-browser-table'
import GitPageLayout from '../components/git-page-layout';
import { FileBrowserEntry, FileBrowserMessage } from '../lib/types';
import useWorker from '../lib/use-worker';

const GitTreePage: NextPage = () => {
  const [ state, setState ] = useState<FileBrowserEntry[]>([]);
  const router = useRouter()

  // instantiate webworker and set up message listener
  const [isReady, sendCommand ] = useWorker((msg: FileBrowserMessage) => {
    switch (msg.command) {
      case 'cwd':
        break
      case 'readdir':
        setState(msg.data)
        break;
      default:
        console.log('Unexpected message:', msg)
    }
  })

  useEffect(() => {
    if (!isReady) return

    // this page is accessed under the route alias /{provider}/{owner}/{repo}/tree/{:path}
    // or the shorter alias for the root, /{provider}/{owner}/{repo}
    const treePath: string = (() => {
      const parts  = router.asPath.split('/')
      // if it's the short alias, the treePath is '/'
      if (parts.length === 4) return '.'
      // otherwise slice off the first several parts of the path: ['/github', '/owner', '/repo', '/tree']
      else if (parts.length > 5) return parts.slice(5).join('/')
      else throw Error(`unexpected path (${parts.length}): ${router.asPath}`)
    })()
    sendCommand({ command: 'getDir', dirName: treePath })
    console.log('path:', treePath)
  }, [isReady, router.asPath])

  const onEntryClick = (entry: FileBrowserEntry) => {
    switch (entry.type) {
      case 'directory': {
        const href = `github/foster/wasm-file-browser/tree/${entry.relativePath}`
        router.push(href)
        break
      }
      case 'file': {
        const href = `github/foster/wasm-file-browser/blob/${entry.relativePath}`
        router.push(href)
        break
      }
    }
  };

  if (isReady) {
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
