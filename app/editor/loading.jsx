import { SpinnerIcon } from '@phosphor-icons/react/dist/ssr'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <SpinnerIcon className='animate-spin text-violet-500' size={48} />
      <p className='mt-4 text-lg text-gray-700'>Loading...</p>
    </div>
  )
}

export default Loading
