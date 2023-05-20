import { Outlet } from 'solid-start'
import { Header } from '~/components/Header.jsx'
import { SideMenu } from '~/components/SideMenu'
import { createDrawerOpen } from '~/providers/ScrollWidthProvider'

export default function App() {
  const drawerOpen = createDrawerOpen()

  return (
    <div class='h-screen w-screen flex flex-col bg-backgroundColor'>
      <Header />
      <div class='flex max-h-[calc(100vh-5rem)] h-full max-lg:flex-col overflow-scroll'>
        <div
          class={`duration-500 ${
            drawerOpen() === true
              ? 'lg:w-[15rem] w-full max-lg:max-h-96 max-lg:h-16'
              : 'w-0 max-lg:h-0 opacity-0'
          }`}
        >
          <SideMenu />
        </div>
        <div
          class={`flex flex-col h-full lg:justify-center lg:px-20 px-6 pt-6 pb-2 min-h-0 ${
            drawerOpen() === true ? 'lg:w-[calc(100vw-15rem)]' : 'lg:w-full'
          } duration-500`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}
