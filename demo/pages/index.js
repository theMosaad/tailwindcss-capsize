import Head from 'next/head'
import Typography from '../components/Typography'
import GithubLink from '../components/GithubLink'
import Logo from '../components/Logo'

export default function Index() {
  return (
    <div className="antialiased text-gray-900">
      <Head>
        <title>Tailwind CSS and Capsize</title>
      </Head>
      <div className="font-sans px-4 py-10 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-16 lg:px-8 xl:max-w-6xl">
        <article>
          <h1 className="sr-only">Tailwind CSS and Capsize</h1>
          <div className="space-y-10 sm:space-y-12 lg:space-y-20 xl:space-y-24">
            <div className="space-y-10 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <Logo />
              <GithubLink />
            </div>
            <div className="flex space-x-8">
              <Typography />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
