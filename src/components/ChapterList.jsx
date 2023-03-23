import { getChapterList } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { For } from 'solid-js'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { createSelectedFont } from '~/providers/FontProvider'

export const ChapterList = (props) => {
  const params = useParams()
  const font = createSelectedFont()

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
      style={{ 'font-family': font() }}
      class='text-textColor h-full w-full snap-center'
    >
      <For
        each={chapterList()}
        fallback={<div class='text-textColor'>Loading Chapter List...</div>}
      >
        {(chapter) => (
          <li
            onClick={[handleChapterLink, chapter.chapterNumber]}
            class='cursor-pointer'
          >
            {chapter.chapterName}
          </li>
        )}
      </For>
    </ul>
  )
}
