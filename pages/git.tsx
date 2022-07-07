import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import FileBrowserTable from '../components/file-browser-table'
import FileView from '../components/file-view';
import GitPageLayout from '../components/git-page-layout';
import { FileBrowserCommand, FileBrowserEntry, FileBrowserFile, FileBrowserMessage, FileBrowserMessageEvent } from '../lib/types';

type State = FileBrowserEntry[] | FileBrowserFile
function isFiles(state: State): state is FileBrowserEntry[] {
  return Array.isArray(state);
}
function isFile(state: State): state is FileBrowserFile {
  return typeof state === 'string';
}

const GitPage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ state, setState ] = useState<State>([]);
  const workerRef = useRef<Worker | null>(null);

  // instantiate webworker and set up message listener
  useEffect(() => {
    const abortController = new AbortController();

    const worker = new Worker(new URL('../lib/my_worker.ts', import.meta.url));
    worker.addEventListener('message', ({data: msg}: FileBrowserMessageEvent) => {

      switch (msg.command) {
        case 'ready':
          setLoaded(true);
          break;
        case 'cwd':
          break;
        case 'readdir':
          setState(msg.data);
          break;
        case 'readfile':
          setState(msg.data);
          break;
        default:
          // this should be unreachable if the switch is exhaustive
          let _: never = msg
          console.log(`Unexpected message: ${_}`)
      }

    }, { signal: abortController.signal });

    workerRef.current = worker;

    return () => {
      abortController.abort();
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // shadow window.postMesage with a typed version that sends to webworker
  const postMessage = (message: FileBrowserCommand) => {
    workerRef.current?.postMessage(message)
  }

  const onEntryClick = (entry: FileBrowserEntry) => {
    switch (entry.type) {
      case 'directory':
        throw new Error('directory clicks not implemented')
      case 'file':
        postMessage({
          command: 'getFile',
          fileName: entry.name
        })
        break
    }
  };

  if (isLoaded && isFiles(state)) {
    return (<GitPageLayout><FileBrowserTable data={state} onEntryClick={onEntryClick} /></GitPageLayout>)
  } else if (isLoaded && isFile(state)) {
    return (<GitPageLayout><FileView contents={state} /></GitPageLayout>);
  } else {
    return (<div>Loading...</div>)
  }
}

export default GitPage;
