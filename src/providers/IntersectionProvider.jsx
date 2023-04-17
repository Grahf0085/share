import { createSignal, createContext, useContext } from 'solid-js'

export const IntersectionContext = createContext()

export const IntersectionProvider = (props) => {
  const [refForIntersection, setRefForIntersection] = createSignal([])

  return (
    <IntersectionContext.Provider
      value={[refForIntersection, setRefForIntersection]}
    >
      {props.children}
    </IntersectionContext.Provider>
  )
}

export const createBookRefs = () => {
  const bookRefs = useContext(IntersectionContext)[0]
  return bookRefs
}

export const createSetBookRefs = () => {
  const setBookRefs = useContext(IntersectionContext)[1]
  return setBookRefs
}
