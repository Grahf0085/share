import { For, Show, createSignal, createEffect } from 'solid-js'
import {
  createSelectedFont,
  createSelectedFontSize,
  createSelectedLineHeight,
} from '~/providers/FontProvider'
import { NoteSpan } from './NoteSpan'
import { SeeAlso } from './SeeAlso'
import {
  createNewSetScrollWidth,
  createFullTextRef,
} from '~/providers/ScrollWidthProvider'
import { createSetBookRefs } from '~/providers/IntersectionProvider'

export const Word = (props) => {
  let footnoteCount = -1
  const font = createSelectedFont()
  const lineHeight = createSelectedLineHeight()
  const fontSize = createSelectedFontSize()

  const [seeAlsoText, setSeeAlsoText] = createSignal('')
  const [seeAlsoReference, setSeeAlsoReference] = createSignal()

  const setScrollWidth = createNewSetScrollWidth()
  const fullTextRef = createFullTextRef()
  const setBookRefs = createSetBookRefs()

  createEffect(() => {
    const additionalText = seeAlsoText()
    setScrollWidth(fullTextRef().scrollWidth)
    return additionalText
  })

  return (
    <div class='flex w-full snap-center overflow-y-auto overflow-x-hidden text-textColor'>
      <p
        ref={(el) => {
          setBookRefs((p) => [...p, el])
        }}
        style={{
          'font-size': fontSize(),
          'line-height': lineHeight(),
          'font-family': font(),
          width: seeAlsoText() ? '66.666667%' : '100%',
          'transition-duration': '500ms',
        }}
        class='whitespace-pre-wrap py-2 lg:py-4 lg:px-14'
        data-chapter={`Chapter: ${props.chapterNumber}`}
        data-book={props.title}
      >
        <For each={props.text}>
          {(word) => {
            if (word.match(/.+[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g)) {
              let endIndex
              for (let value of word) {
                if (value.match(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/))
                  endIndex = word.lastIndexOf(value)
              }
              footnoteCount++
              const wordForFootnote = word.match(/.+[⁰¹²³⁴⁵⁶⁷⁸⁹]+/)
              const wordNotForFootnote = word.substring(endIndex + 1) //used for words with superscripts that don't have a space between superscript and next word
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
          <div class='w-full mt-6 grid grid-flow-col auto-cols-max gap-x-8 items-center'>
            <span class='font-semibold'>See Also:</span>
            <For each={props.seeAlsoArray} fallback={<></>}>
              {(seeAlso) => (
                /* creates item to click if user wants to see seeAlso */
                <SeeAlso
                  seeAlso={seeAlso}
                  seeAlsoText={seeAlsoText()}
                  setSeeAlsoText={setSeeAlsoText}
                  setSeeAlsoReference={setSeeAlsoReference}
                />
              )}
            </For>
          </div>
        </Show>
      </p>
      {/* actual text from other book when user opens it from SeeAlso component */}
      <Show when={seeAlsoText() !== ''} fallback={<></>}>
        <figure
          style={{
            'font-size': fontSize(),
            'line-height': lineHeight(),
            'font-family': font(),
          }}
          class='w-1/3 h-max bg-subMenuColor rounded-sm p-4'
        >
          <button type='button' onClick={() => setSeeAlsoText('')}>
            Close
          </button>
          <figcaption class='py-4'>
            <cite>{seeAlsoReference()?.title}</cite>
            &nbsp Chapter {seeAlsoReference()?.chapter}
          </figcaption>
          <blockquote>
            <p class='bg-subMenuColor'>{seeAlsoText()}</p>
          </blockquote>
        </figure>
      </Show>
    </div>
  )
}
