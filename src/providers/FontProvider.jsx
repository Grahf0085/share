import { createSignal, createContext, useContext } from 'solid-js'

export const FontContext = createContext()

export const FontProvider = (props) => {
  const [selectedFont, setSelectedFont] = createSignal('Inter')

  return (
    <FontContext.Provider value={[selectedFont, setSelectedFont]}>
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
