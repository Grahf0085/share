import { getBookInfo } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { createEffect, For } from 'solid-js'
import { createSelectedFont } from '~/providers/FontProvider'
import { createSetBookRefs } from '~/providers/IntersectionProvider'

export const BookInfo = () => {
  const params = useParams()
  const font = createSelectedFont()
  const setBookRefs = createSetBookRefs()

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
          style={{ 'font-family': font() }}
          class='text-textColor h-full w-full snap-center'
          data-chapter='Title'
          data-book={params.title}
        >
          <li>
            <cite>
              {info.bookTitle}
              {info.subTitle !== '' ? ': ' + info.subTitle : ''}
            </cite>
          </li>
          <li>Published: {info.pubDate}</li>
          <li>
            Translated By: {info.translatorName} in {info.translatedDate}
          </li>
        </ul>
      )}
    </For>
  )
}
