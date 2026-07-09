import './style.scss'
import About from './sections/About'
import Contact from './sections/Contact'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Loader from './Loader'

export default function Home() {
  return (
    <>
      <Loader />
      <main id="top" className="home-page">
        <Hero />
        <About />
        <Work />
      </main>
      <Contact />
    </>
  )
}
