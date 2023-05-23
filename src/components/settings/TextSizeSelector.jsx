import { For } from 'solid-js'
import {
  createSelectedFontSize,
  createSetSelectedFontSize,
} from '~/providers/FontProvider'

export const TextSizeSelector = () => {
  const fontSizes = [
    { name: 'small', size: '0.875rem' },
    { name: 'normal', size: '1rem' },
    { name: 'large', size: '1.125rem' },
    { name: 'x-large', size: '1.25rem' },
  ]

  const selectedFontSize = createSelectedFontSize()
  const setSelectedFontSize = createSetSelectedFontSize()

  return (
    <For
      each={fontSizes}
      fallback={<div class='text-textColor'>Loading Font Sizes</div>}
    >
      {(fontSize) => {
        return (
          <li
            style={{
              'border-left':
                selectedFontSize() !== fontSize.size
                  ? 'solid 2px var(--menu-color)'
                  : 'solid 2px white',
              'border-right':
                selectedFontSize() !== fontSize.size
                  ? 'solid 2px var(--menu-color)'
                  : 'solid 2px white',
            }}
            class='font-rubik rounded-sm hover:bg-subMenuColor text-textColor list-none text-sm self-center'
          >
            <button
              type='button'
              onClick={() => setSelectedFontSize(fontSize.size)}
              class='w-full h-full text-start py-4 px-4'
            >
              {fontSize.name}
            </button>
          </li>
        )
      }}
    </For>
  )
}
