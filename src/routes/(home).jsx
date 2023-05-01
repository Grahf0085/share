import { useParams, Outlet } from 'solid-start'
import { createSignal, For, Show, useTransition } from 'solid-js'
import { getAllTitles, getTranslations } from '~/server/database'
import { createServerData$ } from 'solid-start/server'
import { A } from '@solidjs/router'
import face from '~/assets/face.png'
/* import { Theme } from '../components/Theme.jsx' */
import { FontSelector } from '~/components/FontSelector.jsx'
/* import { Search } from '~/components/Search.jsx' */
import { AiOutlineMenu, AiOutlineCloseCircle } from 'solid-icons/ai'
import { BsGridFill } from 'solid-icons/bs'
import {
  createDrawerOpen,
  createSetDrawerOpen,
} from '~/providers/ScrollWidthProvider'

export default function App() {
  const [selectedTitle, setSelectedTitle] = createSignal()
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false)

  const drawerOpen = createDrawerOpen()
  const setDrawerOpen = createSetDrawerOpen()

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
    <div class='h-screen w-screen grid grid-rows-[10%_90%] bg-backgroundColor'>
      <header class='grid grid-cols-[5%_90%_5%] font-rubik'>
        <button
          onClick={() => setDrawerOpen(!drawerOpen())}
          class='text-textColor hover:bg-subMenuColor rounded-sm h-full w-full flex justify-center items-center'
        >
          <BsGridFill size={36} />
        </button>
        <nav class='flex md:justify-around bg-menuBackground bg-no-repeat bg-right rounded-sm'>
          {/* =========================================================================== */}
          {/* MOBILE MENU */}
          {/* =========================================================================== */}

          <div //change to button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
            class='md:hidden pl-4 text-textColor self-center'
          >
            <Show
              when={mobileMenuOpen() === false}
              fallback={<AiOutlineCloseCircle size={34} />}
            >
              <AiOutlineMenu size={34} />
            </Show>
          </div>

          {/* =========================================================================== */}
          {/* END MOBILE MENU */}
          {/* =========================================================================== */}

          <For each={titles()} fallback={<div>Loading Titles...</div>}>
            {(title) => (
              <menu
                onMouseOver={() => start(() => setSelectedTitle(title))}
                class='md:flex group items-center relative hidden'
              >
                <li class='text-xl text-textColor border-textColor rounded-sm group-hover:border-subMenuColor group-hover:bg-menuColor p-4'>
                  <span
                    style={{
                      padding: '0.5rem',
                      'border-bottom-width': '2px',
                      'border-style':
                        decodeURI(params.title) === title ? 'solid' : 'dotted',
                    }}
                  >
                    {title}
                  </span>
                </li>
                {/* <Show when={title === selectedTitle()}> */}
                <menu class='absolute top-16 w-full hidden bg-subMenuColor group-hover:block rounded-sm'>
                  <For
                    each={translators()}
                    fallback={<div>Loading Translators...</div>}
                  >
                    {(translator) => (
                      <li class='text-center p-4 text-textColor'>
                        <A href={`/book/${selectedTitle()}/${translator}`}>
                          {translator}
                        </A>
                      </li>
                    )}
                  </For>
                </menu>
                {/* </Show> */}
              </menu>
            )}
          </For>
        </nav>
        <A href='/'>
          <button
            type='button'
            onClick={() => setSelectedTitle(undefined)}
            class='flex items-center justify-center h-full w-full hover:bg-subMenuColor rounded-sm'
          >
            <img
              src={face}
              alt="Nietzsche's Face"
              class='w-6/12 rounded-full'
            />
          </button>
        </A>
        {/* <menu class=1group flex items-center justify-center relative pr-4 text-textColor'> */}
        {/*   <img src={face} alt='Nietzsche' class='h-10 w-10 rounded-full' /> */}
        {/*   <menu class='absolute w-full p-2 top-16 hidden bg-subMenuColor group-hover:block outline outline-2 outline-offset-1 rounded-md outline-menuColor'> */}
        {/*     <For each={fonts}>{(font) => <FontSelector font={font} />}</For> */}
        {/*     <li class='py-2 text-center'> */}
        {/*       <Theme /> */}
        {/*     </li> */}
        {/*   </menu> */}
        {/* </menu> */}
      </header>
      <div class='flex'>
        <div
          style={{
            width: drawerOpen() === true ? '25%' : '0px',
            'transition-duration': '500ms',
          }}
        >
          <Show when={drawerOpen() === true} fallback={<div />}>
            <p class='text-textColor'>
              Lorem ipsum dolor sit amet, qui minim labore adipisicing minim
              sint cillum sint consectetur cupidatat.
            </p>
            <For each={fonts}>{(font) => <FontSelector font={font} />}</For>
          </Show>
        </div>
        <div
          style={{
            width: drawerOpen() === true ? '75%' : '100%',
            'transition-duration': '500ms',
          }}
          class='flex flex-col'
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}
