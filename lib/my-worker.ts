import { DateTime } from 'luxon'
import { FileBrowserCommandEvent, FileBrowserEntry, FileBrowserMessage, FileBrowserMessageEvent } from './types';

// export empty object to force tsc to treat this as a module
export default {};

/* @ts-ignore */
self.Module = {
  locateFile: function(s: any) {
    return 'https://unpkg.com/wasm-git@0.0.8/' + s;
  }
};

// shadow postMessage with a type-safe version
const postMessage = (message: FileBrowserMessage) => self.postMessage(message)

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
  lg.callMain(['clone', 'http://localhost:3000/_github.com/foster/wasm-file-browser.git', 'testrepo']);

  postMessage({
    command: 'ready'
  });

  FS.chdir('./testrepo');

  postMessage({
    command: 'cwd',
    data: FS.cwd()
  });

  self.addEventListener('message', ({data: msg}: FileBrowserCommandEvent) => {
    switch (msg.command) {
      case 'getFile':
        const fileContents = FS.readFile(msg.fileName, { encoding: 'utf8' });
        postMessage({
          command: 'readfile',
          fileName: 'README.md',
          data: fileContents
        });
        break;
      case 'getDir':
        const fs = FS
        const {path, node} = FS.lookupPath(msg.dirName)
        console.log(`listing ${path}`)

        postMessage({
          command: 'readdir',
          data: fs.readdir(msg.dirName)
            .filter((entry: string) => !entry.startsWith('.'))
            .map((entryName: string) => {
              const relativePath = msg.dirName !== '.' ? `${msg.dirName}/${entryName}` : entryName
              const fullPath = `${path}/${entryName}`
              return pathToEntry(entryName, relativePath, fullPath)
            })
        });
        break;
    }
  });

  function pathToEntry(entryName: string, relativePath: string, fullPath: string): FileBrowserEntry {
    const { node: { mode } } = FS.lookupPath(relativePath)
    const isFile = FS.isFile(mode);
    const {date, messageFirst: message} = getPathHistory(relativePath)
    return {
      name: entryName,
      relativePath,
      type: isFile ? 'file' : 'directory',
      modified: date,
      message: message
    }
  }

  function getPathHistory(path: string): ParsedCommit {
    const log = lg.callWithOutput(['log', '-n 1', '--', path]);
    console.log('log', '--', path, '--', log)
    return parseCommitLog(log);
  }
}

type ParsedCommit = {
  commitId: string;
  author: string;
  date: number;
  messageFirst: string;
  messageFull: string;
}
function parseCommitLog(logMessage: string): ParsedCommit {
  const logAsArray = logMessage.split('\n');
  const DATE_FORMAT = 'EEE MMM dd HH:mm:ss yyyy ZZZ';

  if (logAsArray.length < 5)
    throw new Error(`Invalid logMessage format. Expected at least 5 lines: ${logMessage}`);

  // the wasm-git log output pads day-of-month with a space
  // this regex replaces the space with a 0 to make it compatible with the luxon parser
  // ex Jun  7 2022 -> Jun 07 2022
  // note: this regex contains a lookbehind, which only works in chrome
  const dateRaw = logAsArray[2].substring(8);
  const dateFixed = dateRaw.replace(/(?<=^\w\w\w \w\w\w )\s(?=\d)/, '0')

  return {
    commitId: logAsArray[0].substring(7),
    author: logAsArray[1].substring(8),
    date: DateTime.fromFormat(dateFixed, DATE_FORMAT).toMillis(),
    messageFirst: logAsArray[4].trimStart(),
    messageFull: logAsArray.splice(4).map(s => s.trimStart()).join('\n').trimEnd()
  }
}
