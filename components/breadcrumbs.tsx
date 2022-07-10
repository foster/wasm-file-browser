import React, { ReactElement } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';

type Props = {
  pathSegments: string[]
}

const toBreadcrumbs: (pathSegments: string[], basePath: string) => ReactElement[] = (pathSegments, basePath) => {
  const lastIndex = pathSegments.length - 1
  return pathSegments.map((segmentName, idx) => {
    if (idx === lastIndex) {
      return <span key={idx}>{segmentName}</span>
    } else if (idx === 0) {
      return <>
        <Link key={idx} href={basePath}><a>{segmentName}</a></Link>
        <span className="px-1">/</span>
      </>
    } else {
      const relevantSegments = pathSegments.slice(1, idx + 1).join('/')
      return <>
        <Link key={idx} href={`${basePath}/tree/${relevantSegments}`}><a>{segmentName}</a></Link>
        <span className="px-1">/</span>
      </>
    }
  })
}

const Breadcrumbs: React.FC<Props> = ({pathSegments}) => {
  const router = useRouter()

  const basePath = `/github/${router.query.user}/${router.query.repo}`
  return (
    <div>
      {toBreadcrumbs(pathSegments, basePath)}
    </div>
  )
}

export default Breadcrumbs
