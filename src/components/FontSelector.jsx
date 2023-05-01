import {
  createSelectedFont,
  createSetSelectedFont,
} from '~/providers/FontProvider.jsx'

export const FontSelector = (props) => {
  const selectedFont = createSelectedFont()
  const setSelectedFont = createSetSelectedFont()

  return (
    <li
      style={{
        'font-family': props.font,
        border: selectedFont() === props.font ? 'solid' : 'none',
      }}
      class='py-2 w-full text-center border-x-2 border-menuColor rounded-md hover:bg-menuColor text-textColor'
    >
      <button type='button' onClick={() => setSelectedFont(props.font)}>
        {props.font}
      </button>
    </li>
  )
}
