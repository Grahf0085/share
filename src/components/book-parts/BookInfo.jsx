import { getBookInfo } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { createEffect, For } from 'solid-js'
import {
  createSelectedFont,
  createSelectedFontSize,
  createSelectedLineHeight,
} from '~/providers/FontProvider'
import { createSetBookRefs } from '~/providers/IntersectionProvider'

export const BookInfo = () => {
  const params = useParams()
  const font = createSelectedFont()
  const setBookRefs = createSetBookRefs()
  const lineHeight = createSelectedLineHeight()
  const fontSize = createSelectedFontSize()

  const titleSize = () => parseFloat(fontSize()) * 2 + 'rem'
  const otherFontSize = () => parseFloat(fontSize()) * 1.5 + 'rem'

  const bookInfo = createServerData$(
    (value) => getBookInfo(value[0], value[1]),
    {
      key() {
        return [params.title, params.translator]
      },
    }
  )

  return (
    <For
      each={bookInfo()}
      fallback={<div class='text-textColor'>Loading Book Info...</div>}
    >
      {(info) => (
        <ul
          ref={(el) => {
            setBookRefs((p) => [...p, el])
            createEffect(() => {
              setBookRefs((p) =>
                p.filter((i) => i.getAttribute('data-book') === params.title)
              )
            })
          }}
          style={{
            'line-height': lineHeight(),
            'font-family': font(),
          }}
          class='text-textColor h-full w-full snap-center flex justify-center md:gap-32 gap-10 items-center flex-col overflow-scroll'
          data-chapter='Title'
          data-book={params.title}
        >
          <li
            style={{
              'font-size': titleSize(),
            }}
            class='font-bold'
          >
            <cite>
              {info.bookTitle}
              {info.subTitle !== '' ? ': ' + info.subTitle : ''}
            </cite>
          </li>
          <li
            style={{
              'font-size': otherFontSize(),
            }}
            class='font-medium'
          >
            Published: {info.pubDate}
          </li>
          <li
            style={{
              'font-size': otherFontSize(),
            }}
            class='font-medium'
          >
            Translated By {info.translatorName}, {info.translatedDate}
          </li>
        </ul>
      )}
    </For>
  )
}
