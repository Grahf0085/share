import { createSignal, Show } from 'solid-js'
import { useParams } from 'solid-start'
import { Theme } from './Theme'
import { FaSolidFont } from 'solid-icons/fa'
import { AiOutlineLineHeight } from 'solid-icons/ai'
/* import { IndBookSearch } from './IndBookSearch' */
import { AiOutlineFontSize } from 'solid-icons/ai'
import { BiRegularChevronUp, BiRegularChevronDown } from 'solid-icons/bi'
import { TransitionComponent } from './TransitionComponent'
import { LineHeightSelector } from './settings/LineHeightSelector'
import { TextSizeSelector } from './settings/TextSizeSelector'
import { FontSelector } from './settings/FontSelector'

export const SideMenu = () => {
  const params = useParams()

  const [fontsOpen, setFontsOpen] = createSignal(false)
  const [lineHeightOpen, setLineHeightOpen] = createSignal(false)
  const [fontSizeOpen, setFontSizeOpen] = createSignal(false)

  return (
    <div class='flex lg:flex-col max-lg:w-full max-md:justify-center items-center h-full max-lg:relative lg:pl-4'>
      <Theme />
      <Show
        when={params.title}
        fallback={
          <div class='text-textColor text-center'>
            Select a Book for more Options
          </div>
        }
      >
        <button
          type='button'
          onClick={() => {
            if (window.matchMedia('(max-width: 1024px)').matches) {
              setLineHeightOpen(false)
              setFontSizeOpen(false)
            }
            setFontsOpen(!fontsOpen())
          }}
          class='text-textColor rounded-sm hover:bg-subMenuColor lg:w-full py-4 px-2 flex justify-between items-center'
        >
          <figure class='flex'>
            <FaSolidFont size={30} />
            <figcaption class='max-md:hidden flex items-center'>
              Font
            </figcaption>
          </figure>
          <TransitionComponent
            component={<BiRegularChevronUp size={30} />}
            fallback={<BiRegularChevronDown size={30} />}
            showWhen={fontsOpen()}
            enterDuration={500}
            exitDuration={0}
            wFull={false}
          />
        </button>
        <TransitionComponent
          component={<FontSelector />}
          showWhen={fontsOpen()}
          enterDuration={500}
          exitDuration={500}
          wFull={true}
        />
        <button
          type='button'
          onClick={() => {
            if (window.matchMedia('(max-width: 1024px)').matches) {
              setFontsOpen(false)
              setLineHeightOpen(false)
            }
            setFontSizeOpen(!fontSizeOpen())
          }}
          class='text-textColor rounded-sm hover:bg-subMenuColor py-4 px-2 flex lg:w-full justify-between items-center'
        >
          <figure class='flex'>
            <AiOutlineFontSize size={30} />
            <figcaption class='max-md:hidden flex items-center'>
              Font Size
            </figcaption>
          </figure>
          <TransitionComponent
            component={<BiRegularChevronUp size={30} />}
            fallback={<BiRegularChevronDown size={30} />}
            showWhen={fontSizeOpen()}
            enterDuration={500}
            exitDuration={0}
            wFull={false}
          />
        </button>
        <TransitionComponent
          component={<TextSizeSelector />}
          showWhen={fontSizeOpen()}
          enterDuration={500}
          exitDuration={500}
          wFull={true}
        />
        <button
          type='button'
          onClick={() => {
            if (window.matchMedia('(max-width: 1024px)').matches) {
              setFontsOpen(false)
              setFontSizeOpen(false)
            }
            setLineHeightOpen(!lineHeightOpen())
          }}
          class='text-textColor rounded-sm hover:bg-subMenuColor py-4 px-2 flex lg:w-full justify-between items-center'
        >
          <figure class='flex'>
            <AiOutlineLineHeight size={30} />
            <figcaption class='max-md:hidden flex items-center'>
              Line Height
            </figcaption>
          </figure>
          <TransitionComponent
            component={<BiRegularChevronUp size={30} />}
            fallback={<BiRegularChevronDown size={30} />}
            showWhen={lineHeightOpen()}
            enterDuration={500}
            exitDuration={0}
            wFull={false}
          />
        </button>
        <TransitionComponent
          component={<LineHeightSelector />}
          showWhen={lineHeightOpen()}
          enterDuration={500}
          exitDuration={500}
          wFull={true}
        />
      </Show>
    </div>
  )
}
