import { createSignal } from 'solid-js'
import { Footnotes } from './Footnotes'

export const NoteSpan = (props) => {
  const [showFootnotes, setShowFootnotes] = createSignal(false)

  return (
    <span class='inline-flex'>
      <button
        type='button'
        onClick={() => setShowFootnotes(!showFootnotes())}
        class='font-bold'
      >
        {props.wordForFootnote + ' '}
      </button>
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
