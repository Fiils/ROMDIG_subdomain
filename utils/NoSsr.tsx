import { Fragment, useEffect, useState } from 'react'

interface NoSSRProps { 
    children: any;
    fallback: any;
}

export const NoSSR = ({children, fallback} : NoSSRProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return <Fragment>{isMounted ? children : fallback}</Fragment>
}