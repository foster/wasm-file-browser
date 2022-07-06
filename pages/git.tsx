import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import FileBrowserTable from '../components/file-browser-table'
import { FileBrowserEntry } from '../lib/types';

const GitPage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);
  const [ files, setFiles ] = useState<FileBrowserEntry[]>([]);

  // instantiate webworker and set up message listener
  useEffect(() => {
    const abortController = new AbortController();

    const worker = new Worker(new URL('../lib/my_worker.ts', import.meta.url));
    worker.addEventListener('message', ({data}) => {

      console.log(data);
      if (data.command === 'ready') setLoaded(true);
      if (data.command === 'readdir') setFiles(data.data);

    }, { signal: abortController.signal });

    return () => {
      abortController.abort();
      worker.terminate();
    };
  }, []);

  return (
    <div>
      { isLoaded ? <FileBrowserTable data={files} /> : 'Loading' }
    </div>
  )
}

export default GitPage;


// https://github.com/github/docs

// This gets called on every request
export async function getServerSideProps() {
  const props = {};
  return { props };
}