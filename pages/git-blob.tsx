import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import Breadcrumbs from '../components/breadcrumbs';
import FileContentsView from '../components/file-contents';
import FileSummary from '../components/file-summary';
import GitPageLayout from '../components/git-page-layout';
import { CommitSummary, FileBrowserMessage } from '../lib/types';
import useWorker from '../lib/use-worker';

type State = {
  path: string[]
  commit: CommitSummary
  contents: string
}
const GitBlobPage: NextPage = () => {
  const [ state, setState ] = useState<State | null>(null);

  const router = useRouter()

  // instantiate webworker and set up message listener
  const [isWorkerReady, sendCommand] = useWorker((msg: FileBrowserMessage) => {
    switch (msg.command) {
      case 'readfile':
        setState({ path: msg.fileName.split('/'), ...msg.data })
        break;
      default:
        console.log('Unexpected message:', msg)
    }
  })

  // when webworker is ready, send a 'readFile' command
  useEffect(() => {
    if (isWorkerReady) {
      // this page is accessed under the route alias /{provider}/{owner}/{repo}/blob/{:path}
      // slice off the first several parts of the path: ['/github', '/owner', '/repo', '/blob']
      const filePath = router.asPath.split('/').slice(5).join('/')

      console.log(`sending readFile command for ${filePath}`)
      sendCommand({command: 'getFile', fileName: filePath})
    }
  }, [isWorkerReady, router])

  if (state !== null) {
    return (
      <GitPageLayout>
        <Breadcrumbs pathSegments={state.path} />
        <FileSummary commit={state.commit} />
        <div className="mb-5"></div>
        <FileContentsView contents={state.contents} />
      </GitPageLayout>
    );
  } else {
    return (<div>Loading...</div>)
  }
}

export default GitBlobPage;
