import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import FileBrowserTable from '../components/file-browser-table'
import FileView from '../components/file-view';
import GitPageLayout from '../components/git-page-layout';
import { FileBrowserCommand, FileBrowserEntry, FileBrowserFile, FileBrowserMessage, FileBrowserMessageEvent } from '../lib/types';
import useWorker from '../lib/use-worker';

const GitBlobPage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ state, setState ] = useState<FileBrowserFile>("");
  const workerRef = useRef<Worker | null>(null);

  // instantiate webworker and set up message listener
  const workerClient = useWorker((msg: FileBrowserMessage) => {
    switch (msg.command) {
      case 'readfile':
        setLoaded(true)
        setState(msg.data)
        break;
      default:
        console.log(`Unexpected message: ${msg}`)
    }
  })

  useEffect(() => {
    // obviously setTimeout is a hack and useWorker should have an onReady hook
    setTimeout(() => workerClient.sendCommand({command: 'getFile', fileName: 'README.md'}), 2000)
  }, [])

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
