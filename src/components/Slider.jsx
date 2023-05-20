export const Slider = (props) => {
  let sliderRef

  const handleInput = () => {
    const percentScrolled = sliderRef.value / props.maxPage
    const scrollWidth =
      props.fullTextRef.scrollWidth - props.fullTextRef.clientWidth
    props.fullTextRef.scrollLeft = percentScrolled * scrollWidth
    props.fullTextRef.focus()
  }

  return (
    <div class='flex lg:justify-evenly justify-end mt-auto lg:bg-gradient-to-r from-menuColor via-subMenuColor to-menuColor w-full lg:flex-row flex-wrap-reverse items-center self-center'>
      <input
        type='range'
        value={props.currentPage}
        max={props.maxPage}
        onInput={handleInput}
        onChange={(event) => props.setCurrentPage(parseInt(event.target.value))}
        ref={sliderRef}
        class='slider lg:w-9/12 w-full appearance-none bg-subMenuColor rounded-sm overflow-hidden cursor-pointer mx-2 border-2 border-subMenuColor'
      />
      <div class='rounded-sm bg-subMenuColor h-fit px-4 py-1 text-textColor w-28 text-center max-lg:m-2'>
        {props.currentPage + 1}/{props.maxPage + 1}
      </div>
      <div class='rounded-sm bg-subMenuColor h-fit px-4 py-1 text-textColor w-28 text-center max-lg:m-2'>
        {props.currentChapter === 'Chapter: 0'
          ? 'Preface'
          : `${props.currentChapter}`}
      </div>
    </div>
  )
}
