import { useEffect } from 'react'
import CustomCursor from '@/components/CustomCursor/index'
import Header from '@/components/Header/index'
import Home from '@/pages/Home/index'
import { disposeApp, initApp } from '@/lib/init-app'

export default function App() {
  useEffect(() => {
    initApp()
    return () => disposeApp()
  }, [])

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <CustomCursor />
      <Header />
      <Home />
    </>
  )
}
