import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Avatar from './Avatar'
type Profiles = any['public']['Tables']['profiles']['Row']

export default function Account({ session }: { session: Session }) {
    const supabase = useSupabaseClient<any>()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState<Profiles['username']>(null)
    const [website, setWebsite] = useState<Profiles['website']>(null)
    const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null)

    useEffect(() => {
        getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!user) throw new Error('No user')

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        username,
        website,
        avatar_url,
    }: {
        username: Profiles['username']
        website: Profiles['website']
        avatar_url: Profiles['avatar_url']
    }) {
        try {
            setLoading(true)
            if (!user) throw new Error('No user')

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget w-[50%] mx-auto">
            {user && <Avatar
                uid={user.id}
                url={avatar_url}
                size={150}
                onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ username, website, avatar_url: url })
                }}
            />}
            <div>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="email">Email</label>
                <input
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="username">Username</label>
                <input
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="website">Website</label>
                <input
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="button primary block button primary block bg-green-500 text-center rounded-lg py-2 my-3 w-full"
                    onClick={() => updateProfile({ username, website, avatar_url })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block bg-red-500 text-white text-center rounded-lg py-2 my-3 w-full" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </div>
    )
}