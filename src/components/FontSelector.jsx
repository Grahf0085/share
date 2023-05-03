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
      class='p-4 border-x-2 border-menuColor rounded-sm hover:bg-subMenuColor text-textColor'
    >
      <button type='button' onClick={() => setSelectedFont(props.font)}>
        {props.font}
      </button>
    </li>
  )
}
