import { createSelectedFont } from '~/providers/FontProvider'
/* import { IndBookSearch } from './IndBookSearch' */

export const Slider = (props) => {
  let sliderRef

  const font = createSelectedFont()

  const handleInput = () => {
    const percentScrolled = sliderRef.value / props.maxPage
    const scrollWidth = props.scrollWidth - props.clientWidth
    props.setScrollLeft(percentScrolled * scrollWidth)
    props.fullTextRef.scrollLeft = percentScrolled * scrollWidth
    props.fullTextRef.focus()
  }

  return (
    <div class='flex justify-center mt-auto'>
      {/* <IndBookSearch /> */}
      <div class='w-11/12 rounded-md flex justify-center items-center bg-gradient-to-r from-menuColor via-subMenuColor to-menuColor'>
        <input
          type='range'
          value={props.currentPage}
          max={props.maxPage}
          onInput={handleInput}
          onChange={(event) =>
            props.setCurrentPage(parseInt(event.target.value))
          }
          ref={sliderRef}
          class='slider w-9/12 appearance-none bg-subMenuColor rounded-md overflow-hidden cursor-pointer'
        />
        <div
          style={{ 'font-family': font() }}
          class='text-textColor w-auto flex'
        >
          <div class='rounded-md bg-subMenuColor h-fit px-4 py-1 mx-4'>
            {props.currentPage + 1}/{props.maxPage + 1}
          </div>
          <div class='rounded-md bg-subMenuColor h-fit px-4 py-1 mx-2'>
            {props.currentChapter === 'Chapter: 0'
              ? 'Preface'
              : `${props.currentChapter}`}
          </div>
        </div>
      </div>
    </div>
  )
}
