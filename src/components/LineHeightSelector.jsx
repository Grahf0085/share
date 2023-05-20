import { For } from 'solid-js'
import {
  createSelectedLineHeight,
  createSetSelectedLineHeight,
} from '~/providers/FontProvider'

export const LineHeightSelector = () => {
  const lineHeights = [
    { name: 'Tight', height: 1.25 },
    { name: 'Snug', height: 1.375 },
    { name: 'Normal', height: 1.5 },
    { name: 'Relaxed', height: 1.625 },
    { name: 'Loose', height: 2 },
  ]

  const selectedLineHeight = createSelectedLineHeight()
  const setSelectedLineHeight = createSetSelectedLineHeight()

  return (
    <For
      each={lineHeights}
      fallback={<div class='text-textColor'>Loading Line Heights</div>}
    >
      {(lineHeight) => {
        return (
          <li
            style={{
              'border-left':
                selectedLineHeight() !== lineHeight.height
                  ? 'solid 2px var(--menu-color)'
                  : 'solid 2px white',
              'border-right':
                selectedLineHeight() !== lineHeight.height
                  ? 'solid 2px var(--menu-color)'
                  : 'solid 2px white',
            }}
            class='font-rubik rounded-sm hover:bg-subMenuColor text-textColor list-none text-sm self-center'
          >
            <button
              type='button'
              onClick={() => setSelectedLineHeight(lineHeight.height)}
              class='w-full h-full text-start py-4 px-4'
            >
              {lineHeight.name}
            </button>
          </li>
        )
      }}
    </For>
  )
}
