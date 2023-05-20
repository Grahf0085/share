import { createServerData$ } from 'solid-start/server'
import { getQuote } from '~/server/database'

export default function Home() {
  const quote = createServerData$(() => getQuote())

  return (
    <figure class='text-textColor text-xl lg:text-4xl self-center'>
      <blockquote class='italic pb-10'>{quote()?.quoteText}</blockquote>
      <figcaption class='text-right'>-N.</figcaption>
    </figure>
  )
}
