import { For } from 'solid-js'
import { useParams } from 'solid-start'
import { createServerAction$ } from 'solid-start/server'
import { getSingleSearch } from '~/server/database'
/* import { AiOutlineSearch } from 'solid-icons/ai' */

export const IndBookSearch = () => {
  const params = useParams()

  const [submitting, { Form }] = createServerAction$(async (form) => {
    const searchString = form.get('search')
    const title = form.get('title')
    const translator = form.get('translator')

    return await getSingleSearch(searchString, title, translator)
  })

  return (
    <>
      <Form>
        <input
          name='search'
          placeholder='Search Selected Book'
          onFocus={(e) => (e.target.value = '')}
          class='bg-transparent border-b-2'
        />
        <input name='title' class='hidden' value={params.title} />
        <input name='translator' class='hidden' value={params.translator} />
        <button type='submit' disabled={submitting.pending}>
          Search
        </button>
        {/* <div class='flex w-full h-[calc(100vh-5rem)] bg-red-500'>Test</div> */}
      </Form>
      <For each={submitting.result}>
        {(result) => <h1>{result.paragraphText}</h1>}
      </For>
    </>
  )
}
