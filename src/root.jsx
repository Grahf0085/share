// @refresh reload
import { Link } from '@solidjs/router'
import { Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'
import { FontProvider } from './providers/FontProvider'
import { IntersectionProvider } from './providers/IntersectionProvider'
import { ScrollWidthProvider } from './providers/ScrollWidthProvider'
import './root.css'

export default function Root() {
  return (
    <Html lang='en'>
      <Head>
        <Title>Nietzsche's Grave</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        {/* <Link rel='icon' href='../src/assets/face.png' /> */}
        <Link rel='preconnect' href='https://rsms.me/' />
        <Link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
        <Link rel='shortcut icon' type='image' href='../src/assets/face.png' />
        <Dynamic component='script'>{`
if (sessionStorage.theme === 'light') 
  if(window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.add('light')

if (sessionStorage.theme === 'dark') 
  if(window.matchMedia('(prefers-color-scheme: light)').matches)
    document.documentElement.classList.add('dark') 
`}</Dynamic>
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <FontProvider>
              <IntersectionProvider>
                <ScrollWidthProvider>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </ScrollWidthProvider>
              </IntersectionProvider>
            </FontProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
