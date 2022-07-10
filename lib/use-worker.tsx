import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FileBrowserCommand, FileBrowserMessage, FileBrowserMessageEvent } from './types';

type WorkerCallbackFn = (msg: FileBrowserMessage) => void
type WorkerCommandFn = (command: FileBrowserCommand) => void

export type UseWorkerReturnVal = [
  isReady: boolean,
  sendCommand: WorkerCommandFn
]

interface WorkerClientInternal {
  isReady: boolean,
  sendCommand: WorkerCommandFn,
  subscribe(callback: WorkerCallbackFn): void
  unsubscribe(callback: WorkerCallbackFn): void
}

const WorkerContext = createContext<WorkerClientInternal | null>(null)

type WorkerProviderProps = {
  children: React.ReactElement
}
const WorkerProvider: React.FC<WorkerProviderProps> = ({children}) => {
  const [isReady, setReady] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const subscribers = useRef<WorkerCallbackFn[]>([])

  useEffect(() => {
    if (workerRef.current === null) {
      console.log('!!! starting a new worker !!!')
      const worker = workerRef.current = new Worker(new URL('./my-worker.ts', import.meta.url))
      
      worker.addEventListener('message', ({data: msg}: FileBrowserMessageEvent) => {
        if (msg.command === 'ready') setReady(true)
        subscribers.current.forEach(cb => cb(msg))
      })
    }
  }, [])

  const impl: WorkerClientInternal = {
    isReady,
    sendCommand(command: FileBrowserCommand) {
      workerRef.current?.postMessage(command)
    },
    subscribe(callback: WorkerCallbackFn) {
      subscribers.current = [...subscribers.current, callback]
    },
    unsubscribe(callback: WorkerCallbackFn) {
      subscribers.current = subscribers.current.filter(cb => cb !== callback)
    }
  }

  return (<WorkerContext.Provider value={impl}>{children}</WorkerContext.Provider>)
}

export {WorkerProvider}
export default function useWorker(callback: WorkerCallbackFn): UseWorkerReturnVal {
  const workerClient = useContext(WorkerContext)

  if (workerClient === null)
    throw new Error('WorkerContext is undefined')
  
  useEffect(() => {
    console.log('attaching sub')
    workerClient.subscribe(callback)
    return () => {
      console.log(`killing sub`)
      workerClient.unsubscribe(callback)
    }
  }, [])

  return [
    workerClient.isReady,
    workerClient.sendCommand
  ]
}
