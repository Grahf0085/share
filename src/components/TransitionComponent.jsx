import { Show } from 'solid-js'
import { Transition } from 'solid-transition-group'

export const TransitionComponent = (props) => {
  return (
    <Transition
      onEnter={(el, done) => {
        const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: props.enterDuration,
        })
        a.finished.then(done)
      }}
      onExit={(el, done) => {
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: props.exitDuration,
        })
        a.finished.then(done)
      }}
    >
      <Show when={props.showWhen === true} fallback={props.fallback}>
        <ul
          class={`max-lg:flex overflow-scroll ${
            props.wFull === true
              ? 'max-lg:bg-subMenuColor w-full max-lg:fixed max-lg:top-36'
              : 'max-lg:transparent w-auto'
          }`}
        >
          {props.component}
        </ul>
      </Show>
    </Transition>
  )
}
