import {
  onMount,
  createSignal,
  createEffect,
  onCleanup,
  on,
  Show,
} from 'solid-js'
import { useParams } from 'solid-start'
import { BookInfo } from '~/components/BookInfo'
import { ChapterList } from '~/components/ChapterList'
import { Chapters } from '~/components/Chapters'
import { Slider } from '~/components/Slider'
import { createSelectedFont } from '~/providers/FontProvider'
import {
  createNewScrollWidth,
  createNewSetScrollWidth,
  createFullTextRef,
  createSetFullTextRef,
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

  const maxPage = () => Math.ceil(scrollWidth() / windowWidth() - 1)

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

  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft')
      setCurrentPage(Math.max(0, currentPage() - 1))
    if (event.key === 'ArrowRight')
      setCurrentPage(Math.min(maxPage(), currentPage() + 1))
  }

  function throttled(delay, fn) {
    let lastCall = 0
    return function (...args) {
      const now = new Date().getTime()
      if (now - lastCall < delay) {
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
    setScrollWidth(fullTextRef().scrollWidth)
    setClientWidth(fullTextRef().clientWidth)
    scrollIntoView(textOnScreen(), {
      scrollMode: 'if-needed',
      block: 'nearest',
    }).then(() => {
      setScrollLeft(fullTextRef().scrollLeft)
      const percentScrolled = scrollLeft() / (scrollWidth() - clientWidth())
      const newPage = Math.ceil(percentScrolled * maxPage())
      setCurrentPage(newPage)
      bookRefs().forEach((reference) => intersectionObserver.observe(reference))
    })
  }

  onMount(() => {
    //disable browser search
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 114 || (event.ctrlKey && event.keyCode === 70))
        event.preventDefault()
    })

    window.addEventListener('resize', handleWindowSize)

    fullTextRef().addEventListener(
      'wheel',
      throttled(350, (event) => {
        if (event.deltaX > 0)
          setCurrentPage(Math.min(maxPage(), currentPage() + 1))

        if (event.deltaX < 0) setCurrentPage(Math.max(0, currentPage() - 1))
      })
    )
  })

  onCleanup(() => {
    window.removeEventListener('resize', handleWindowSize)
    intersectionObserver.disconnect()
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

  createEffect(
    on(
      font,
      () => {
        setScrollWidth(fullTextRef().scrollWidth)
        handleWindowSize()
      },
      { defer: true }
    )
  )

  createEffect(() => (fullTextRef().scrollLeft = scrollLeft()))

  createEffect(() => {
    const book = `${params.title} + ${params.translator}`
    if (book) {
      setCurrentPage(0)
      fullTextRef().scrollLeft = 0
      setScrollWidth(fullTextRef().scrollWidth)
      setClientWidth(fullTextRef().clientWidth)
      setScrollLeft(fullTextRef().scrollLeft)
      fullTextRef().focus()
    }
  })

  return (
    <Show when={params.title}>
      <div
        ref={(el) => setFullTextRef(el)}
        tabIndex={-1}
        onKeyDown={handleKeydown}
        class='h-[88vh] flex flex-col flex-wrap overflow-y-hidden snap-mandatory snap-x no-scrollbar'
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
      />
    </Show>
  )
}
