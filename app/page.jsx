import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/dist/server/api-utils'

const page = async() => {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  if(!user){
    redirect('/auth/login');
  }

  const { data: posts=[] } = await supabase.from("posts").select("*").eq("user_id", user.id).order("created_at", {ascending: false});
  

  return (
    <div className='bg-violet-300 flex flex-col items-center justify-center h-screen'>
      {posts.length === 0 ? (
        <div className='bg-violet-100 border-2 border-violet-400 rounded-lg px-4 py-3 text-gray-700 flex flex-col items-center justify-center w-full max-w-md'>
          <h1 className='text-2xl font-bold mb-4'>No posts yet</h1>
          <button className='bg-violet-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-violet-500 transition duration-300'>
            <Link href="/editor">Create your first post</Link>
          </button>
        </div>
      ) : (
        <div className='max-w-4xl w-full px-4 py-10'>
          <h1 className='text-3xl font-bold text-violet-700 mb-6'>Your Posts</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {posts.map(post => (
              <div key={post.id} className='bg-violet-100 border-2 border-violet-400 rounded-lg px-4 py-3 text-gray-700 flex flex-col justify-between'>
                <div>
                  <h2 className='text-xl font-bold mb-2'>{post.title}</h2>
                  <p className='text-sm text-gray-500 mb-4'>{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className='text-gray-700'>{post.excerpt}</p>
                </div>
                <button className='bg-violet-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-violet-500 transition duration-300 mt-4 self-start'>
                  <Link href={`/editor/${post.id}`}>Edit Post</Link>    
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}             

export default page
