import { useParams, Outlet } from 'solid-start'
import { createSignal, For, Show, useTransition } from 'solid-js'
import { getAllTitles, getTranslations } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { A } from '@solidjs/router'
import face from '~/assets/face.png'
import { Theme } from '../components/Theme.jsx'
import { FontSelector } from '~/components/FontSelector.jsx'
import { Search } from '~/components/Search.jsx'

export default function App() {
  const [selectedTitle, setSelectedTitle] = createSignal()
  const [pending, start] = useTransition()
  const params = useParams()

  const fonts = [
    'Atkinson Hyperlegible',
    'Bookerly',
    'Inter',
    'Lexend',
    'Merriweather',
  ]

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
          <div class='flex items-center'>
            <Search titles={titles()} />
          </div>
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
                  } border-textColor rounded-md group-hover:border-transparent group-hover:bg-menuColor`}
                >
                  {title}
                </li>
                <Show when={title === selectedTitle()}>
                  <menu class='absolute top-16 w-full hidden bg-subMenuColor group-hover:block outline outline-2 outline-offset-0 rounded-md outline-menuColor'>
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
          <menu class='text-textColor absolute w-full p-2 top-16 hidden bg-subMenuColor group-hover:block outline outline-2 outline-offset-1 rounded-md outline-menuColor'>
            <For each={fonts}>{(font) => <FontSelector font={font} />}</For>
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
