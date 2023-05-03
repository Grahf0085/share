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
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

export default function Fulltext() {
  let intersectionObserver

  const [windowWidth, setWindowWidth] = createSignal(window.innerWidth)
  const [clientWidth, setClientWidth] = createSignal()
  const [scrollLeft, setScrollLeft] = createSignal()
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

  const maxPage = () => Math.ceil(scrollWidth() / windowWidth() - 1)

  createEffect(() => console.log('max page: ', maxPage()))

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
      }, 100)
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

  const handleWindowSize = () => {
    if (windowWidth() === window.innerWidth) {
      bookRefs().forEach((reference) =>
        intersectionObserver.unobserve(reference)
      )
    }
    setWindowWidth(window.innerWidth)
    /* setScrollWidth(fullTextRef().scrollWidth) */
    setClientWidth(fullTextRef().clientWidth)
    scrollIntoView(textOnScreen(), {
      block: 'center',
      inline: 'center',
      behavior: 'smooth',
    })
      .then(() => {
        createEffect(() => {
          setScrollLeft(fullTextRef().scrollLeft)
          const percentScrolled = scrollLeft() / (scrollWidth() - clientWidth())
          const newPage = Math.ceil(percentScrolled * maxPage())
          setCurrentPage(newPage)
        })
      })
      .finally(() => {
        bookRefs().forEach((reference) =>
          intersectionObserver.observe(reference)
        )
      })
  }

  onMount(() => {
    //disable browser search
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 114 || (event.ctrlKey && event.keyCode === 70))
        event.preventDefault()
    })

    const fullTextResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log('size changed: ', entry.target)
        setScrollWidth(entry.target.scrollWidth)
      }
    })

    setScrollWidth(fullTextRef().scrollWidth)

    fullTextResizeObserver.observe(fullTextRef())

    window.addEventListener('resize', handleWindowSize)

    fullTextRef().addEventListener(
      'wheel',
      throttled(false, 350, (event) => {
        if (event.deltaX > 0)
          setCurrentPage(Math.min(maxPage(), currentPage() + 1))

        if (event.deltaX < 0) setCurrentPage(Math.max(0, currentPage() - 1))
      })
    )

    fullTextRef().addEventListener(
      'keydown',
      throttled(true, 350, (event) => {
        if (event.key === 'ArrowLeft')
          setCurrentPage(Math.max(0, currentPage() - 1))
        if (event.key === 'ArrowRight')
          setCurrentPage(Math.min(maxPage(), currentPage() + 1))
      })
    )
  })

  createEffect(() => {
    intersectionObserver = new IntersectionObserver(
      intersectionObserverCallback,
      intersectionObserverOptions
    )

    bookRefs().forEach((reference) => intersectionObserver.observe(reference))

    return () => {
      bookRefs().forEach((reference) =>
        intersectionObserver.unobserve(reference)
      )
    }
  })

  onCleanup(() => {
    window.removeEventListener('resize', handleWindowSize)
    window.removeEventListener('wheel', throttled)
    fullTextRef().removeEventListener('keydown', throttled)
    intersectionObserver.disconnect()
  })

  createEffect(
    on(
      [font, drawerOpen],
      () => {
        /* setScrollWidth(fullTextRef().scrollWidth) */
        handleWindowSize()
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
              setScrollWidth(fullTextRef().scrollWidth)
              setClientWidth(fullTextRef().clientWidth)
              setScrollLeft(fullTextRef().scrollLeft)
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
        scrollWidth={scrollWidth()}
        clientWidth={clientWidth()}
        setScrollLeft={setScrollLeft}
        setCurrentPage={setCurrentPage}
        maxPage={maxPage()}
        currentChapter={currentChapter()}
        fullTextRef={fullTextRef()}
      />
    </>
  )
}
