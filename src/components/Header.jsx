import { Show, For, createSignal, useTransition } from 'solid-js'
import {
  createDrawerOpen,
  createSetDrawerOpen,
} from '~/providers/ScrollWidthProvider'
import { BsGridFill } from 'solid-icons/bs'
import { AiOutlineCloseCircle } from 'solid-icons/ai'
import { createServerData$ } from 'solid-start/server'
import { getAllTitles, getTranslations } from '~/server/database'
import { useParams } from 'solid-start'
import { A } from '@solidjs/router'
import face from '~/assets/face.png'
import { AiFillBook } from 'solid-icons/ai'
import { BiRegularChevronDown, BiRegularChevronUp } from 'solid-icons/bi'

export const Header = () => {
  const drawerOpen = createDrawerOpen()
  const setDrawerOpen = createSetDrawerOpen()

  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false)
  const [selectedTitle, setSelectedTitle] = createSignal()

  const params = useParams()

  const [pending, start] = useTransition()
  pending() //what do I do with this???

  const titles = createServerData$(() => getAllTitles())
  let translators = createServerData$((value) => getTranslations(value), {
    key() {
      return selectedTitle()
    },
  })

  return (
    <header class='flex justify-between font-rubik h-20'>
      {/* height in header is later used to calculate height of main div */}
      <button
        onClick={() => {
          setDrawerOpen(!drawerOpen())
          setMobileMenuOpen(false)
        }}
        class='text-textColor hover:bg-subMenuColor rounded-sm h-full w-24 flex justify-center items-center'
      >
        <BsGridFill size={34} />
      </button>
      <nav class='flex w-full lg:justify-around bg-menuBackground bg-no-repeat bg-right rounded-sm'>
        {/* =========================================================================== */}
        {/* MOBILE BOOK MENU */}
        {/* =========================================================================== */}

        <button
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen())
            setSelectedTitle(undefined)
            setDrawerOpen(false)
          }}
          class='lg:hidden text-textColor'
        >
          <Show
            when={mobileMenuOpen() === false}
            fallback={<AiOutlineCloseCircle size={34} />}
          >
            <AiFillBook size={34} />
          </Show>
        </button>
        {/* =========================================================================== */}
        {/* END MOBILE BOOK MENU */}
        {/* =========================================================================== */}

        <div
          style={{
            left: mobileMenuOpen() ? '0' : '-100%',
          }}
          class='lg:flex lg:static fixed top-20 w-full lg:justify-around duration-500 bg-menuColor lg:bg-transparent h-full'
        >
          <For
            each={titles()}
            fallback={<div class='text-textColor'>Loading Titles...</div>}
          >
            {(title) => (
              <menu
                onMouseOver={() => start(() => setSelectedTitle(title))}
                class='group lg:relative'
              >
                <li class='text-xl text-textColor rounded-sm group-hover:bg-menuColor p-4'>
                  <button
                    onClick={() =>
                      start(() =>
                        selectedTitle() === title
                          ? setSelectedTitle(undefined)
                          : setSelectedTitle(title)
                      )
                    }
                    style={{
                      padding: '0.5rem',
                      'border-style':
                        decodeURI(params.title) === title ? 'solid' : 'dashed',
                      'transition-duration': '500ms',
                    }}
                    class='border-textColor group-hover:border-subMenuColor lg:cursor-default flex justify-between w-full lg:border-b-2 relative'
                  >
                    {title}
                    <Show
                      when={selectedTitle() === title}
                      fallback={
                        <span class='lg:hidden'>
                          <BiRegularChevronDown size={30} />
                        </span>
                      }
                    >
                      <span class='lg:hidden'>
                        <BiRegularChevronUp size={30} />
                      </span>
                    </Show>
                  </button>
                </li>
                <menu
                  class={`lg:absolute lg:block lg:top-16 w-full lg:opacity-0 bg-subMenuColor group-hover:opacity-100 duration-500 rounded-sm ${
                    selectedTitle() === title ? 'max-lg:block' : 'max-lg:hidden'
                  }`}
                >
                  <For each={translators()}>
                    {(translator) => (
                      <A href={`/book/${selectedTitle()}/${translator}`}>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          class='w-full'
                        >
                          <li class='lg:text-center text-left ml-6 p-4 lg:m-0 text-textColor rounded-sm'>
                            {translator}
                          </li>
                        </button>
                      </A>
                    )}
                  </For>
                </menu>
              </menu>
            )}
          </For>
        </div>
      </nav>
      <A href='/'>
        <button
          type='button'
          onClick={() => {
            setSelectedTitle(undefined)
            setMobileMenuOpen(false)
          }}
          class='flex items-center justify-center h-full w-24 hover:bg-subMenuColor rounded-sm'
        >
          <img src={face} alt="Nietzsche's Face" class='w-6/12 rounded-full' />
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
  )
}
