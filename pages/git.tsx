import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import FileBrowserTable from '../components/file-browser-table'

// async function initGit() {
//   const lg = Module;
//   const FS = Module.FS;
//   const MEMFS = FS.filesystems.MEMFS;

//   // FS.mkdir('/working');
//   // FS.mount(MEMFS, {}, '/working');
//   // FS.chdir('/working');

//   // await lg.callMain(['clone', 'http://localhost/github/github/docs.git', 'testrepo']);

//   // return FS.readdir('testrepo');
// }

const GitPage: NextPage = () => {
  const [ isLoaded, setLoaded ] = useState(false);

  // instantiate webworker and set up message listener
  useEffect(() => {
    const abortController = new AbortController();

    const worker = new Worker(new URL('../lib/my_worker.ts', import.meta.url));
    worker.addEventListener('message', ({data}) => {

      console.log(data);
      if (data.command === 'ready') setLoaded(true);

    }, { signal: abortController.signal });

    return () => {
      abortController.abort();
      worker.terminate();
    };
  }, []);

  return (
    <div>
      { isLoaded ? <FileBrowserTable /> : 'Loading' }
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