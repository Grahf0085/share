import { For } from 'solid-js'
import { createServerData$ } from 'solid-start/server'
import { getSeeAlso } from '~/server/database'

export const SeeAlso = (props) => {
  const seeAlso = createServerData$((value) => getSeeAlso(value[0]), {
    key() {
      return [props.seeAlso]
    },
  })

  return (
    <For each={seeAlso()} fallback={<></>}>
      {(seeAlso) => (
        <button
          type='button'
          onClick={() => {
            props.setSeeAlsoText(
              props.seeAlsoText === seeAlso.paragraphText
                ? ''
                : seeAlso.paragraphText
            )
            props.setSeeAlsoReference({
              title: `${seeAlso.bookTitle}`,
              chapter: `${seeAlso.chapterNumber}`,
            })
          }}
          class='bg-subMenuColor rounded-md p-2'
        >
          <cite>{seeAlso.bookTitle}</cite>, Chapter {seeAlso.chapterNumber},
          Paragraph {seeAlso.paragraphNumber}
        </button>
      )}
    </For>
  )
}
