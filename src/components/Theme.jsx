/* stolen from https://github.com/LenaSchnedlitz/old-homepage/blob/master/src/lib/components/DarkModeToggle.svelte */

import { onMount, createSignal, Show } from 'solid-js'
import { AiFillBulb, AiOutlineBulb } from 'solid-icons/ai'

export const Theme = () => {
  const STORAGE_KEY = 'theme'
  const DARK_PREFERENCE = '(prefers-color-scheme: dark)'

  const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
  }

  const [currentTheme, setTheme] = createSignal()

  const prefersDarkThemes = () => window.matchMedia(DARK_PREFERENCE).matches

  onMount(() => {
    applyTheme()
    window.matchMedia(DARK_PREFERENCE).addEventListener('change', applyTheme())

    return () => {
      window.removeEventListener('change', applyTheme)
    }
  })

  const applyTheme = () => {
    const preferredTheme = prefersDarkThemes() ? THEMES.DARK : THEMES.LIGHT
    setTheme(sessionStorage.getItem(STORAGE_KEY) ?? preferredTheme)

    if (currentTheme() === THEMES.DARK) {
      document.documentElement.classList.add(THEMES.DARK)
      document.documentElement.classList.remove(THEMES.LIGHT)
    } else {
      document.documentElement.classList.remove(THEMES.DARK)
      document.documentElement.classList.add(THEMES.LIGHT)
    }
  }

  const toggleTheme = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY)

    if (stored) {
      sessionStorage.removeItem(STORAGE_KEY)
    } else {
      sessionStorage.setItem(
        STORAGE_KEY,
        prefersDarkThemes() ? THEMES.LIGHT : THEMES.DARK
      )
    }

    applyTheme()
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      class='text-textColor rounded-sm hover:bg-subMenuColor lg:w-full py-4 max-lg:pr-4 flex justify-center items-center'
    >
      <Show
        when={currentTheme() === THEMES.DARK}
        fallback={<AiFillBulb size={30} />}
      >
        <AiOutlineBulb size={30} />
      </Show>
    </button>
  )
}
