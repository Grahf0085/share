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
      {(info) => (
        <>
          <br />
          <span>
            {info.bookTitle}, chapter {info.chapterNumber}, paragraph{' '}
            {info.paragraphNumber}
          </span>
        </>
      )}
    </For>
  )
}
