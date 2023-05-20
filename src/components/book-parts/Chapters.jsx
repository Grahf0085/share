import { getChapterList } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { For, onCleanup } from 'solid-js'
import { Paragraphs } from './Paragraphs'
import {
  createSelectedFont,
  createSelectedFontSize,
  createSelectedLineHeight,
} from '~/providers/FontProvider'

export const Chapters = (props) => {
  const params = useParams()
  const font = createSelectedFont()
  const lineHeight = createSelectedLineHeight()
  const fontSize = createSelectedFontSize()

  const chapterList = createServerData$(
    (value) => getChapterList(value[0], value[1]),
    {
      key() {
        return [params.title, params.translator]
      },
    }
  )

  return (
    <For
      each={chapterList()}
      fallback={<div class='text-textColor'>Loading Chapters...</div>}
    >
      {(chapter) => (
        <>
          <h2
            ref={(el) => {
              props.setAllChapters((p) => [...p, el])
              onCleanup(() => {
                props.setAllChapters((p) => p.filter((i) => i !== el))
              })
            }}
            style={{
              'font-size': fontSize(),
              'line-height': lineHeight(),
              'font-family': font(),
            }}
            class='snap-center text-textColor font-bold w-full'
          >
            {chapter.chapterName}
          </h2>
          <Paragraphs chapterNumber={chapter.chapterNumber} />
          <div class='h-full' />
        </>
      )}
    </For>
  )
}
