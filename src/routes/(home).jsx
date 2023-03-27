import { useParams, Outlet } from 'solid-start'
import { createSignal, For, Show, useTransition } from 'solid-js'
import { getAllTitles, getTranslations } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { A } from '@solidjs/router'
import face from '~/assets/face.png'
import { Theme } from '../components/Theme.jsx'
import {
  createSelectedFont,
  createSetSelectedFont,
} from '~/providers/FontProvider.jsx'

export default function App() {
  const [selectedTitle, setSelectedTitle] = createSignal()
  const [pending, start] = useTransition()
  const params = useParams()
  const selectedFont = createSelectedFont()
  const setSelectedFont = createSetSelectedFont()

  const titles = createServerData$(() => getAllTitles())
  const translators = createServerData$((value) => getTranslations(value), {
    key() {
      return selectedTitle()
    },
  })

  console.log('pending is: ', pending()) //what do I do with this???

  return (
    <div class='h-screen flex flex-col bg-backgroundColor'>
      <header class='grid grid-cols-[8fr_1fr] w-screen h-20 font-rubik'>
        <nav class='flex justify-around w-full bg-menuBackground bg-no-repeat bg-right rounded-md'>
          <For each={titles()} fallback={<div>Loading Titles...</div>}>
            {(title) => (
              <menu
                onMouseOver={() => start(() => setSelectedTitle(title))}
                class='group flex items-center relative'
              >
                <li
                  class={`p-2 text-lg text-textColor border-b-2 ${
                    decodeURI(params.title) === title
                      ? 'border-solid'
                      : 'border-dotted'
                  } border-subMenuColor group-hover:border-transparent`}
                >
                  {title}
                </li>
                <Show when={title === selectedTitle()}>
                  <menu class='absolute top-16 w-full hidden bg-subMenuColor group-hover:block outline outline-2 outline-offset-1 rounded-md outline-menuColor'>
                    <For
                      each={translators()}
                      fallback={<div>Loading Translators...</div>}
                    >
                      {(translator) => (
                        <li class='text-center p-2 text-textColor'>
                          <A href={`/book/${selectedTitle()}/${translator}`}>
                            {translator}
                          </A>
                        </li>
                      )}
                    </For>
                  </menu>
                </Show>
              </menu>
            )}
          </For>
        </nav>
        <menu class='group flex items-center justify-center relative'>
          <A href='/'>
            <img
              src={face}
              alt='Nietzsche'
              class='h-10 w-10 cursor-pointer rounded-full'
              onClick={() => setSelectedTitle(undefined)}
            />
          </A>

          <menu class='text-textColor absolute w-full top-16 hidden bg-subMenuColor group-hover:block outline outline-2 outline-offset-1 rounded-md outline-menuColor'>
            <li
              onClick={[setSelectedFont, 'Atkinson Hyperlegible']}
              class={`mx-4 p-1 w-min cursor-pointer border-b-2 border-menuColor font-atkinson ${
                selectedFont() === 'Atkinson Hyperlegible'
                  ? 'border-solid'
                  : 'border-dotted'
              }`}
            >
              Atkinson Hyperlegible
            </li>
            <li
              onClick={[setSelectedFont, 'Bookerly']}
              class={`mx-4 p-1 w-min cursor-pointer border-b-2 border-menuColor font-bookerly ${
                selectedFont() === 'Bookerly' ? 'border-solid' : 'border-dotted'
              }`}
            >
              Bookerly
            </li>
            <li
              onClick={[setSelectedFont, 'Inter']}
              class={`mx-4 p-1 w-min cursor-pointer border-b-2 border-menuColor font-inter ${
                selectedFont() === 'Inter' ? 'border-solid' : 'border-dotted'
              }`}
            >
              Inter
            </li>
            <li
              onClick={[setSelectedFont, 'Lexend']}
              class={`mx-4 p-1 w-min cursor-pointer border-b-2 border-menuColor font-lexend ${
                selectedFont() === 'Lexend' ? 'border-solid' : 'border-dotted'
              }`}
            >
              Lexend
            </li>
            <li
              onClick={[setSelectedFont, 'Merriweather']}
              class={`mx-4 p-1 w-min cursor-pointer border-b-2 border-menuColor font-merriweather ${
                selectedFont() === 'Merriweather'
                  ? 'border-solid'
                  : 'border-dotted'
              }`}
            >
              Merriweather
            </li>
            <li class='p-2'>
              <Theme />
            </li>
          </menu>
        </menu>
      </header>

      <Outlet />
    </div>
  )
}
