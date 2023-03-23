import { createSignal } from 'solid-js'
import { Footnotes } from './Footnotes'

export const NoteSpan = (props) => {
  const [showFootnotes, setShowFootnotes] = createSignal(false)

  return (
    <span class='inline-flex'>
      <span
        onClick={() => setShowFootnotes(!showFootnotes())}
        class='font-bold cursor-pointer'
      >
        {props.wordForFootnote + ' '}
      </span>
      {props.wordNotForFootnote + ' '}
      <Footnotes
        chapterNumber={props.chapterNumber}
        paragraphNumber={props.paragraphNumber}
        showFootnotes={showFootnotes()}
        footnoteCount={props.footnoteCount}
      />
    </span>
  )
}
