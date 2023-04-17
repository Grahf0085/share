import { createServerAction$ } from 'solid-start/server'
import { getSearch } from '~/server/database'

export const Search = () => {
  const [submitting, { Form }] = createServerAction$(async (form) => {
    const searchString = form.get('search')
    return await getSearch(searchString)
  })

  /* const searchResults = createServerData$((value) => getSearch(value[0]), { */
  /*   key() { */
  /*     return [testValue()] */
  /*   }, */
  /* }) */

  /* const handleSubmit = (e) => { */
  /*   e.preventDefault() */
  /*   const formData = new FormData(e.target) */
  /*   console.log('form data: ', formData.get('search')) */
  /* } */

  return (
    <>
      <Form>
        {/* <label for='search-selected-book'> */}
        {/*   <select */}
        {/*     id='search-selected-book' */}
        {/*     name='books' */}
        {/*     class='appearance-none border-none bg-subMenuColor' */}
        {/*   > */}
        {/*     <option value='all'>All</option> */}
        {/*     <For each={props.titles} fallback={<div>Loading Titles...</div>}> */}
        {/*       {(title) => <option value={title}>{title}</option>} */}
        {/*     </For> */}
        {/*   </select> */}
        {/* </label> */}
        <input
          name='search'
          placeholder='Search'
          onFocus={(e) => (e.target.value = '')}
          class='bg-transparent border-b-2'
        />
        <button type='submit' disabled={submitting.pending}>
          Enroll
        </button>
      </Form>
      {/* <For each={submitting.result}> */}
      {/*   {(result) => <h1>{result.paragraphText}</h1>} */}
      {/* </For> */}
    </>
  )
}
