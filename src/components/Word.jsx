import { For } from 'solid-js'
import { createSelectedFont } from '~/providers/FontProvider'
import { NoteSpan } from './NoteSpan'

export const Word = (props) => {
  let footnoteCount = -1
  const font = createSelectedFont()

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
    </p>
  )
}
