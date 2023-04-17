import {
  createSelectedFont,
  createSetSelectedFont,
} from '~/providers/FontProvider.jsx'

export const FontSelector = (props) => {
  const selectedFont = createSelectedFont()
  const setSelectedFont = createSetSelectedFont()

  return (
    <li
      onClick={[setSelectedFont, props.font]}
      style={{ 'font-family': props.font }}
      class={`py-2 w-full text-center cursor-pointer border-x-2 border-menuColor rounded-md hover:bg-menuColor ${
        selectedFont() === props.font ? 'border-solid' : 'border-none'
      }`}
    >
      {props.font}
    </li>
  )
}
