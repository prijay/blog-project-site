"use client";
import React, { useState } from "react";

const SignUp = () => {
const[email, setEmail] =useState("")
const[password, setPassword] = useState('');
const[loading, setLoading] = useState(false);
const[error, setError] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle sign-up logic here
    }
    return (
        <main className='flex flex-col items-center justify-center h-screen'>
            <card className='bg-violet-100 border-2 border-violet-400 rounded-lg px-4 py-3 text-gray-700 flex flex-col items-center justify-center w-full max-w-md'>
                <h1 className="text-2xl font-bold w-full text-center">Sign Up</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4 w-full px-2'>
                    <label htmlFor='email' className='text-sm font-medium w-full'>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className='w-full rounded-md bg-transparent border-2 border-violet-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:pl-2 hover:border-violet-600'
                        required
                    />
                    <label htmlFor='password' className='text-sm font-medium w-full'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='********'
                        className='w-full rounded-md bg-transparent border-2 border-violet-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:pl-2 hover:border-violet-600'
                        required
                    />
                    {error && <p className='text-red-500'>{error}</p>}
                    <button
                        type='submit'
                        className='bg-violet-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-violet-500 transition duration-300'
                    >
                        Sign Up
                    </button>
                    <div>
                        Already have an account? <a href='/auth/login' className='text-violet-800 hover:underline'>Login</a>
                    </div>
                </form>
            </card>
        </main>
    )
}

export default SignUp

