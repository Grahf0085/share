import { createSignal, createContext, useContext } from 'solid-js'

export const ScrollWidthContext = createContext()

export const ScrollWidthProvider = (props) => {
  const [fullTextRef, setFullTextRef] = createSignal()
  const [scrollWidth, setScrollWidth] = createSignal(0)

  /* createEffect(() => { */
  /*   const contentChanged = font() */
  /*   setScrollWidth(fullTextRef.scrollWidth) */
  /*   return contentChanged */
  /* }) */

  return (
    <ScrollWidthContext.Provider
      value={[scrollWidth, setScrollWidth, fullTextRef, setFullTextRef]}
    >
      {props.children}
    </ScrollWidthContext.Provider>
  )
}

export const createNewScrollWidth = () => {
  const newScrollWidth = useContext(ScrollWidthContext)[0]
  return newScrollWidth
}

export const createNewSetScrollWidth = () => {
  const setNewScrollWidth = useContext(ScrollWidthContext)[1]
  return setNewScrollWidth
}

export const createFullTextRef = () => {
  const newFullTextRef = useContext(ScrollWidthContext)[2]
  return newFullTextRef
}

export const createSetFullTextRef = () => {
  const setNewFullTextRef = useContext(ScrollWidthContext)[3]
  return setNewFullTextRef
}
