import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '@/components/Account'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  return (
    <div>
      {!session ? (
        <div className='w-[25%] mx-auto'>
          <h1 className='text-2xl font-bold text-center pt-[10rem]'>Create Account!</h1>
        <Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}} theme='dark'/>
        </div>
      ) : (
        <div className='pt-[7rem]'>
        <Account session={session}/>
        </div>
      )}
    </div>
  )
}
