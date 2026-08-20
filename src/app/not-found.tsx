import Image from 'next/image'
import React from 'react'

export default function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-muted'>
        <Image src="/image.png"
        alt="404"
        width={500}
        height={500}
        className='mx-auto my-10'
        />
        <h1 className='text-center text-3xl font-bold'>Page Not Found</h1>
    </div>
  )
}
