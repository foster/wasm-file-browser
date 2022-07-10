import React from 'react'

type Props = {
  children: React.ReactElement | React.ReactElement[]
}
const GitPageLayout: React.FC<Props> = ({children}) => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full max-w-full py-2 align-middle md:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  </div>
)
export default GitPageLayout
