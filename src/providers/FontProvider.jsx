import { createSignal, createContext, useContext } from 'solid-js'

export const FontContext = createContext()

export const FontProvider = (props) => {
  const [selectedFont, setSelectedFont] = createSignal('Inter')
  const [lineHeight, setLineHeight] = createSignal(1.5)
  const [fontSize, setFontSize] = createSignal('1rem')

  return (
    <FontContext.Provider
      value={[
        selectedFont,
        setSelectedFont,
        lineHeight,
        setLineHeight,
        fontSize,
        setFontSize,
      ]}
    >
      {props.children}
    </FontContext.Provider>
  )
}

export const createSelectedFont = () => {
  const selectedFont = useContext(FontContext)[0]
  return selectedFont
}

export const createSetSelectedFont = () => {
  const setSelectedFont = useContext(FontContext)[1]
  return setSelectedFont
}

export const createSelectedLineHeight = () => {
  const selectedLineHeight = useContext(FontContext)[2]
  return selectedLineHeight
}

export const createSetSelectedLineHeight = () => {
  const setSelectedLineHeight = useContext(FontContext)[3]
  return setSelectedLineHeight
}

export const createSelectedFontSize = () => {
  const selectedFontSize = useContext(FontContext)[4]
  return selectedFontSize
}

export const createSetSelectedFontSize = () => {
  const setSelectedFontSize = useContext(FontContext)[5]
  return setSelectedFontSize
}
