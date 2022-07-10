import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import FileView from '../components/file-view';
import GitPageLayout from '../components/git-page-layout';
import { FileBrowserFile, FileBrowserMessage } from '../lib/types';
import useWorker from '../lib/use-worker';

const GitBlobPage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ state, setState ] = useState<FileBrowserFile>("");

  const router = useRouter()

  // instantiate webworker and set up message listener
  const workerClient = useWorker((msg: FileBrowserMessage) => {
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
    if (workerClient.isReady) {
      // this page is accessed under the route alias /{provider}/{owner}/{repo}/blob/{:path}
      // slice off the first several parts of the path: ['/github', '/owner', '/repo', '/blob']
      const filePath = router.asPath.split('/').slice(5).join('/')

      console.log('sending readFile command for $filePath')
      workerClient.sendCommand({command: 'getFile', fileName: filePath})
    }
  }, [workerClient])

  if (isLoaded) {
    return (
      <GitPageLayout>
        <FileView contents={state} />
      </GitPageLayout>
    );
  } else {
    return (<div>Loading...</div>)
  }
}

export default GitBlobPage;
