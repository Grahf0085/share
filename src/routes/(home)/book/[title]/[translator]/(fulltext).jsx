import { onMount, createSignal, createEffect, onCleanup, on } from 'solid-js'
import { useParams } from 'solid-start'
import { BookInfo } from '~/components/book-parts/BookInfo'
import { ChapterList } from '~/components/book-parts/ChapterList'
import { Chapters } from '~/components/book-parts/Chapters'
import { Slider } from '~/components/Slider'
import { createSelectedFont } from '~/providers/FontProvider'
import {
  createNewScrollWidth,
  createNewSetScrollWidth,
  createFullTextRef,
  createSetFullTextRef,
  createDrawerOpen,
} from '~/providers/ScrollWidthProvider'
import { createBookRefs } from '~/providers/IntersectionProvider'
/* import scrollIntoView from 'smooth-scroll-into-view-if-needed' */

export default function Fulltext() {
  let intersectionObserver
  let fullTextResizeObserver

  const [clientWidth, setClientWidth] = createSignal()
  const [currentPage, setCurrentPage] = createSignal(0)
  const [currentChapter, setCurrentChapter] = createSignal()
  const [allChapters, setAllChapters] = createSignal([])
  const [textOnScreen, setTextOnScreen] = createSignal()

  const params = useParams()

  const font = createSelectedFont()
  const scrollWidth = createNewScrollWidth()
  const setScrollWidth = createNewSetScrollWidth()
  const fullTextRef = createFullTextRef()
  const setFullTextRef = createSetFullTextRef()
  const bookRefs = createBookRefs()
  const drawerOpen = createDrawerOpen()

  const maxPage = () => Math.ceil(scrollWidth() / clientWidth() - 1)

  const intersectionObserverOptions = {
    root: null, // relative to document viewport
    rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
    threshold: 1.0, // visible amount of item shown in relation to root
  }

  const intersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      setTimeout(() => {
        if (entry.isIntersecting) {
          setCurrentChapter(entry.target.getAttribute('data-chapter'))
          setTextOnScreen(entry.target)
        }
      }, 100) //timeout needed for input into range slider and then changing window size.  not sure why
    })
  }

  function throttled(prevDef, delay, fn) {
    let lastCall = 0
    return function (...args) {
      const now = new Date().getTime()
      if (now - lastCall < delay) {
        if (prevDef === true) event.preventDefault()
        return
      }
      lastCall = now
      return fn(...args)
    }
  }

  const handleScrollTo = () => {
    if (textOnScreen()) textOnScreen().scrollIntoView()
    fullTextRef().addEventListener('scroll', () => {
      const percentScrolled =
        fullTextRef().scrollLeft /
        (fullTextRef().scrollWidth - fullTextRef().clientWidth)
      const newPage = Math.ceil(percentScrolled * maxPage())
      setCurrentPage(newPage)
      bookRefs().forEach((reference) => intersectionObserver.observe(reference))
    })
  }

  const handleTransitionRun = () => {
    bookRefs().forEach((reference) => intersectionObserver.unobserve(reference))
  }

  const handleTransitionEnd = () => {
    setScrollWidth(fullTextRef().scrollWidth)
    handleScrollTo()
  }

  onMount(() => {
    //disable browser search
    window.addEventListener('keydown', (event) => {
      if (event.key === 'F3' || (event.ctrlKey && event.key === 'f'))
        event.preventDefault()
    })

    fullTextResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (clientWidth() === fullTextRef().clientWidth) {
          bookRefs().forEach((reference) =>
            intersectionObserver.unobserve(reference)
          )
        }
        setClientWidth(entry.target.clientWidth)
        setScrollWidth(entry.target.scrollWidth)
        handleScrollTo()
      }
    })

    fullTextResizeObserver.observe(fullTextRef())

    fullTextRef().addEventListener(
      'wheel',
      // eslint-disable-next-line solid/reactivity
      throttled(false, 350, (event) => {
        if (event.deltaX > 0)
          setCurrentPage(Math.min(maxPage(), currentPage() + 1))

        if (event.deltaX < 0) setCurrentPage(Math.max(0, currentPage() - 1))
      })
    )

    fullTextRef().addEventListener(
      'keydown',
      // eslint-disable-next-line solid/reactivity
      throttled(true, 350, (event) => {
        if (event.key === 'ArrowLeft')
          setCurrentPage(Math.max(0, currentPage() - 1))
        if (event.key === 'ArrowRight')
          setCurrentPage(Math.min(maxPage(), currentPage() + 1))
      })
    )

    intersectionObserver = new IntersectionObserver(
      intersectionObserverCallback,
      intersectionObserverOptions
    )

    bookRefs().forEach((reference) => intersectionObserver.observe(reference))

    fullTextRef().addEventListener('transitionrun', handleTransitionRun)

    fullTextRef().addEventListener('transitionend', handleTransitionEnd)
    return () => {
      fullTextRef().removeEventListener('transitionend', handleTransitionEnd)
    }
  })

  onCleanup(() => {
    window.removeEventListener('wheel', throttled)
    fullTextRef().removeEventListener('keydown', throttled)
    intersectionObserver.disconnect()
    fullTextResizeObserver.disconnect()
  })

  createEffect(
    on(
      [font, drawerOpen],
      () => {
        handleTransitionEnd()
      },
      { defer: true }
    )
  )

  return (
    <>
      <div
        ref={(el) => {
          setFullTextRef(el)
          createEffect(() => {
            //need to make sure this works for multiple translations of same book
            if (params.title || params.translator) {
              setFullTextRef(el)
              setCurrentPage(0)
              fullTextRef().scrollLeft = 0
              fullTextRef().focus()
            }
          })
        }}
        tabIndex={-1}
        class='flex flex-col flex-wrap overflow-y-hidden snap-mandatory snap-x no-scrollbar'
      >
        <BookInfo />
        <ChapterList
          allChapters={allChapters()}
          maxPage={maxPage()}
          fullTextRef={fullTextRef()}
          setCurrentPage={setCurrentPage}
        />
        <Chapters setAllChapters={setAllChapters} />
      </div>
      <Slider
        currentPage={currentPage()}
        setCurrentPage={setCurrentPage}
        maxPage={maxPage()}
        currentChapter={currentChapter()}
        fullTextRef={fullTextRef()}
      />
    </>
  )
}
