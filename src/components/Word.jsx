import { For, Show } from 'solid-js'
import { createSelectedFont } from '~/providers/FontProvider'
import { NoteSpan } from './NoteSpan'
import { SeeAlso } from './SeeAlso'

export const Word = (props) => {
  let footnoteCount = -1
  const font = createSelectedFont()

  /* const [seeAlsoText, setSeeAlsoText] = createSignal('') */
  /* const [seeAlsoReference, setSeeAlsoReference] = createSignal() */

  return (
    <p
      style={{ 'font-family': font() }}
      class='snap-center text-textColor whitespace-pre-wrap py-4 px-16 overflow-y-auto overflow-x-hidden'
    >
      <For each={props.text}>
        {(word) => {
          if (word.match(/.+[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g)) {
            footnoteCount++
            const wordForFootnote = word.match(/.+[⁰¹²³⁴⁵⁶⁷⁸⁹]+/)
            const findSuperscript = /[⁰¹²³⁴⁵⁶⁷⁸⁹]/g.exec(word)
            const wordNotForFootnote = word.substring(findSuperscript.index + 1) //used for words with superscripts that don't have a space between superscript and next word
            return (
              <NoteSpan
                chapterNumber={props.chapterNumber}
                paragraphNumber={props.paragraphNumber}
                footnoteCount={footnoteCount}
                wordForFootnote={wordForFootnote}
                wordNotForFootnote={wordNotForFootnote}
              />
            )
          }
          return word + ' '
        }}
      </For>
      <Show when={props.seeAlsoArray}>
        <br />
        <br />
        <aside>
          <span class='font-semibold'>See Also:</span>
          <For each={props.seeAlsoArray} fallback={<></>}>
            {(seeAlso) => (
              <SeeAlso
                seeAlso={seeAlso}
                /* seeAlsoText={seeAlsoText()} */
                /* setSeeAlsoText={setSeeAlsoText} */
                /* setSeeAlsoReference={setSeeAlsoReference} */
              />
            )}
          </For>
        </aside>
      </Show>
      {/* <Show when={seeAlsoText() !== ''} fallback={<></>}> */}
      {/*   <div class='w-1/3'> */}
      {/*     <button onClick={() => setSeeAlsoText('')}>Close</button> */}
      {/*     <p> */}
      {/*       {seeAlsoReference()} */}
      {/*       <br /> */}
      {/*       {seeAlsoText()} */}
      {/*     </p> */}
      {/*   </div> */}
      {/* </Show> */}
    </p>
  )
}
