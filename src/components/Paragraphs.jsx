import { getChapterParagraphs } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { useParams } from 'solid-start'
import { For } from 'solid-js'
import { Word } from './Word'

export const Paragraphs = (props) => {
  const params = useParams()

  const paragraphs = createServerData$(
    (value) => getChapterParagraphs(value[0], value[1], value[2]),
    {
      key() {
        return [params.title, params.translator, props.chapterNumber]
      },
    }
  )

  return (
    <For
      each={paragraphs()}
      fallback={<div class='text-textColor'>Loading Paragraphs...</div>}
    >
      {(paragraph) => (
        <Word
          chapterNumber={props.chapterNumber}
          paragraphNumber={paragraph.paragraphNumber}
          text={paragraph.paragraphText.split(' ')}
          seeAlsoArray={paragraph.seeAlso}
          title={params.title}
        />
      )}
    </For>
  )
}
