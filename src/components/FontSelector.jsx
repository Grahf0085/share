import {
  createSelectedFont,
  createSetSelectedFont,
} from '~/providers/FontProvider.jsx'
import { For } from 'solid-js'

export const FontSelector = () => {
  const selectedFont = createSelectedFont()
  const setSelectedFont = createSetSelectedFont()

  const fonts = [
    'Atkinson Hyperlegible',
    'Bookerly',
    'Inter',
    'Lexend',
    'Merriweather',
  ]

  return (
    <For
      each={fonts}
      fallback={<div class='text-textColor'>Loading Fonts</div>}
    >
      {(font) => {
        return (
          <li
            style={{
              'font-family': font,
              'border-left':
                selectedFont() !== font
                  ? 'solid 2px var(--menu-color)'
                  : 'solid 2px white',
              'border-right':
                selectedFont() !== font
                  ? 'solid 2px var(--menu-color)'
                  : 'solid 2px white',
            }}
            class='rounded-sm hover:bg-subMenuColor text-textColor list-none text-sm self-center'
          >
            <button
              type='button'
              onClick={() => setSelectedFont(font)}
              class='w-max h-full text-start py-4 px-4'
            >
              {font}
            </button>
          </li>
        )
      }}
    </For>
  )
}
