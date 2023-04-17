import { getChapterList } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { createEffect, For } from 'solid-js'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { createSelectedFont } from '~/providers/FontProvider'
import { createSetBookRefs } from '~/providers/IntersectionProvider'

export const ChapterList = (props) => {
  const params = useParams()
  const font = createSelectedFont()

  const setBookRefs = createSetBookRefs()

  const chapterList = createServerData$(
    (value) => getChapterList(value[0], value[1]),
    {
      key() {
        return [params.title, params.translator]
      },
    }
  )

  const handleChapterLink = (chapterNumber) => {
    scrollIntoView(props.allChapters[chapterNumber], {
      block: 'nearest',
      scrollMode: 'if-needed',
    }).then(() => {
      const percentScrolled =
        props.fullTextRef.scrollLeft /
        (props.fullTextRef.scrollWidth - props.fullTextRef.clientWidth)
      const newPage = Math.ceil(percentScrolled * props.maxPage)
      props.setCurrentPage(newPage)
    })
  }

  return (
    <ul
      ref={(el) => {
        setBookRefs((p) => [...p, el])
      }}
      style={{ 'font-family': font() }}
      class='text-textColor h-full w-full snap-center'
      data-chapter='Contents'
      data-book={params.title}
    >
      <For
        each={chapterList()}
        fallback={<div class='text-textColor'>Loading Chapter List...</div>}
      >
        {(chapter) => (
          <li
            onClick={() => handleChapterLink(chapter.chapterNumber)}
            class='cursor-pointer'
          >
            {chapter.chapterName}
          </li>
        )}
      </For>
    </ul>
  )
}
