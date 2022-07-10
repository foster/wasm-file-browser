import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import FileContentsView from '../components/file-contents';
import FileSummary from '../components/file-summary';
import GitPageLayout from '../components/git-page-layout';
import { CommitSummary, FileBrowserMessage } from '../lib/types';
import useWorker from '../lib/use-worker';

type State = {
  commit?: CommitSummary,
  contents: string
}
const GitBlobPage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ state, setState ] = useState<State>({ commit: undefined, contents: '' });

  const router = useRouter()

  // instantiate webworker and set up message listener
  const [isWorkerReady, sendCommand] = useWorker((msg: FileBrowserMessage) => {
    switch (msg.command) {
      case 'readfile':
        setLoaded(true)
        setState(msg.data)
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

  if (isLoaded) {
    return (
      <GitPageLayout>
        <FileSummary commit={state.commit!} />
        <div className="mb-5"></div>
        <FileContentsView contents={state.contents} />
      </GitPageLayout>
    );
  } else {
    return (<div>Loading...</div>)
  }
}

export default GitBlobPage;
