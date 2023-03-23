/* import { useParams } from 'solid-start' */

import { createSelectedFont } from '~/providers/FontProvider'

export const Slider = (props) => {
  let sliderRef
  /* const params = useParams() */

  const font = createSelectedFont()

  const handleInput = () => {
    const percentScrolled = sliderRef.value / props.maxPage
    const scrollWidth = props.scrollWidth - props.clientWidth
    props.setScrollLeft(percentScrolled * scrollWidth)
  }

  return (
    <div class='flex justify-center'>
      <div class='w-11/12 h-full rounded-md flex justify-center items-center bg-gradient-to-r from-menuColor via-subMenuColor to-menuColor'>
        <input
          type='range'
          value={props.currentPage}
          max={props.maxPage}
          onInput={handleInput}
          onChange={(event) =>
            props.setCurrentPage(parseInt(event.target.value))
          }
          ref={sliderRef}
          class='slider w-9/12 h-4 appearance-none bg-subMenuColor rounded-md overflow-hidden cursor-pointer'
        />
        <div style={{ 'font-family': font() }} class='text-textColor w-auto'>
          <div class='rounded-md bg-subMenuColor h-fit px-4 mx-4'>
            {props.currentPage + 1}/{props.maxPage + 1}
          </div>
        </div>
      </div>
    </div>
  )
}

{
  /* <span>{decodeURI(params.title)}</span> */
}
