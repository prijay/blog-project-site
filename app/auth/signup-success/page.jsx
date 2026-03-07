import React from 'react'

const SignUpSuccess = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-2'>
     <div className='bg-green-300 border-2 border-green-500 rounded-lg px-4 py-3 text-green-800 flex flex-col items-center justify-center w-full max-w-md'>
    <h1 className=' text-green-800 p-4 rounded-md'>Sign Up Successful</h1>
     <p className='text-center'>You will receive a confirmation email shortly which contains varification link.</p>
    <div className='pt-4'>
        <a href='/auth/login' className='bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 mt-4'>
            Login
        </a>
    </div>
     </div>
      
    </div>
  )
}

export default SignUpSuccess
