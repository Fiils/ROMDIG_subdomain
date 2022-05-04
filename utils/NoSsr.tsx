import { Fragment, useEffect, useState, FC, ReactNode } from 'react'

interface NoSSRProps { 
    fallback: any;
    children: ReactNode;
}

export const NoSSR: FC<NoSSRProps> = ({children, fallback}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return <Fragment>{isMounted ? children : fallback}</Fragment>
}