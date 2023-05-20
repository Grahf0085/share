import { createSignal, createContext, useContext } from 'solid-js'

export const ScrollWidthContext = createContext()

export const ScrollWidthProvider = (props) => {
  const [fullTextRef, setFullTextRef] = createSignal()
  const [scrollWidth, setScrollWidth] = createSignal(
    () => fullTextRef().scrollWidth
  )
  const [drawerOpen, setDrawerOpen] = createSignal(false)

  return (
    <ScrollWidthContext.Provider
      value={[
        scrollWidth,
        setScrollWidth,
        fullTextRef,
        setFullTextRef,
        drawerOpen,
        setDrawerOpen,
      ]}
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

export const createDrawerOpen = () => {
  const newDrawerOpen = useContext(ScrollWidthContext)[4]
  return newDrawerOpen
}

export const createSetDrawerOpen = () => {
  const setNewDrawerOpen = useContext(ScrollWidthContext)[5]
  return setNewDrawerOpen
}
