/* import { createServerAction$ } from 'solid-start/server' */
/* import { getSearch } from '~/server/database' */

import { createSignal, Show } from 'solid-js'

export const IndBookSearch = () => {
  /* const [submitting, { Form }] = createServerAction$(async (form) => { */
  /*   const searchString = form.get('search') */
  /*   return await getSearch(searchString) */
  /* }) */

  const [showSearch, setShowSearch] = createSignal(false)

  return (
    <>
      <button
        onClick={() => setShowSearch(!showSearch())}
        class='text-textColor'
      >
        SearchIcon
      </button>

      <Show when={showSearch() === true}>
        <div
          style={{ height: 'calc(-5rem + 100vh)' }}
          class='w-[33vw] bg-white absolute top-20 left-0'
        >
          HELLO THERE
        </div>
      </Show>
    </>
  )
}
