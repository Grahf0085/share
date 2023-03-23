import { onMount, createSignal, Show, createEffect } from 'solid-js'
import { useParams } from 'solid-start'
import { BookInfo } from '~/components/BookInfo'
import { ChapterList } from '~/components/ChapterList'
import { Chapters } from '~/components/Chapters'
import { Slider } from '~/components/Slider'

export default function Fulltext() {
  let fullTextRef
  const [paragraphsLoaded, setParagraphsLoaded] = createSignal(false)
  const [scrollWidth, setScrollWidth] = createSignal()
  const [clientWidth, setClientWidth] = createSignal()
  const [scrollLeft, setScrollLeft] = createSignal()
  const [currentPage, setCurrentPage] = createSignal(0)
  const [allChapters, setAllChapters] = createSignal([])

  const params = useParams()

  const maxPage = () => Math.ceil(scrollWidth() / window.innerWidth - 1)

  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft')
      setCurrentPage(Math.max(0, currentPage() - 1))
    if (event.key === 'ArrowRight')
      setCurrentPage(Math.min(maxPage(), currentPage() + 1))
  }

  onMount(() => {
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 114 || (event.ctrlKey && event.keyCode === 70))
        event.preventDefault()
    })
  })

  createEffect(() => {
    if (paragraphsLoaded() === 'ready') {
      setScrollWidth(fullTextRef.scrollWidth)
      setClientWidth(fullTextRef.clientWidth)
      setScrollLeft(fullTextRef.scrollLeft)
      fullTextRef.focus()
    }
  })

  createEffect(() => {
    fullTextRef.scrollLeft = scrollLeft()
  })

  createEffect(() => {
    const book = `${params.title} + ${params.translator}`
    if (book) {
      setCurrentPage(0)
      fullTextRef.scrollLeft = 0
    }
  })

  return (
    <>
      <div
        ref={fullTextRef}
        tabIndex={-1}
        onKeyDown={handleKeydown}
        class='h-[88vh] flex flex-col flex-wrap overflow-y-hidden snap-mandatory snap-x no-scrollbar'
      >
        <BookInfo />
        <ChapterList
          allChapters={allChapters()}
          maxPage={maxPage()}
          fullTextRef={fullTextRef}
          setCurrentPage={setCurrentPage}
        />
        <Chapters
          setParagraphsLoaded={setParagraphsLoaded}
          setAllChapters={setAllChapters}
        />
      </div>
      <Show
        when={paragraphsLoaded() === 'ready'}
        fallback={
          <div class='text-textColor'>Loading Paragraphs, then Slider...</div>
        }
      >
        <Slider
          currentPage={currentPage()}
          scrollWidth={scrollWidth()}
          clientWidth={clientWidth()}
          setScrollLeft={setScrollLeft}
          setCurrentPage={setCurrentPage}
          maxPage={maxPage()}
        />
      </Show>
    </>
  )
}
