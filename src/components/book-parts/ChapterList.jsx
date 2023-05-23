import { getChapterList } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { For } from 'solid-js'
import {
  createSelectedFont,
  createSelectedFontSize,
  createSelectedLineHeight,
} from '~/providers/FontProvider'
import { createSetBookRefs } from '~/providers/IntersectionProvider'

export const ChapterList = (props) => {
  const params = useParams()
  const font = createSelectedFont()
  const lineHeight = createSelectedLineHeight()
  const fontSize = createSelectedFontSize()

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
    props.allChapters[chapterNumber].scrollIntoView({ behavior: 'smooth' })
    props.fullTextRef.addEventListener('scroll', () => {
      const percentScrolled =
        props.fullTextRef.scrollLeft /
        (props.fullTextRef.scrollWidth - props.fullTextRef.clientWidth)
      const newPage = Math.ceil(percentScrolled * props.maxPage)
      props.setCurrentPage(newPage)
    })
  }

  return (
    <div class='w-full h-full snap-center overflow-y-scroll lg:flex lg:justify-center'>
      <ul
        ref={(el) => {
          setBookRefs((p) => [...p, el])
        }}
        style={{
          'font-size': fontSize(),
          'line-height': lineHeight(),
          'font-family': font(),
        }}
        class='text-textColor w-fit lg:h-fit h-full flex flex-col'
        data-chapter='Contents'
        data-book={params.title}
      >
        <For
          each={chapterList()}
          fallback={<div class='text-textColor'>Loading Chapter List...</div>}
        >
          {(chapter) => (
            <li class='w-full bg-subMenuColor rounded-sm mb-4 p-4 self-center max-lg:text-center'>
              <button
                type='button'
                onClick={() => handleChapterLink(chapter.chapterNumber)}
              >
                {chapter.chapterName}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
