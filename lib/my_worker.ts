// this doesn't do anything, i'm just proving that this is a module
import { Foo } from './types'

// export empty object to force tsc to treat this as a module
export default {};

/* @ts-ignore */
self.Module = {
  locateFile: function(s: any) {
    return 'https://unpkg.com/wasm-git@0.0.8/' + s;
  }
};

importScripts('https://unpkg.com/wasm-git@0.0.8/lg2.js');

/* @ts-ignore */
Module.onRuntimeInitialized = () => {
  /* @ts-ignore */
  const lg = Module;

  /* @ts-ignore */
  const FS = Module.FS as any;

  FS.mkdir('/working');
  /* @ts-ignore */
  FS.mount(MEMFS, {}, '/working');
  FS.chdir('/working');

  /* @ts-ignore */
  lg.callMain(['clone', 'http://localhost:3000/github/github/dev.git', 'testrepo']);

  postMessage({
    command: 'ready'
  });

  FS.chdir('./testrepo');

  postMessage({
    command: 'cwd',
    data: FS.cwd()
  });

  postMessage({
    command: 'readdir',
    data: FS.readdir('.')
  });

  const readme = FS.readFile('README.md', { encoding: 'utf8' });
  // const files = FS.readdir('testrepo');
  postMessage({
    command: 'readfile',
    fileName: 'README.md',
    data: readme
  });
}
