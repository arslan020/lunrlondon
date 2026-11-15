import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setError(data?.error || 'Could not log in.')
        return
      }
      navigate('/admin')
    } catch {
      setError('Could not log in.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#141413] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">LUNR</p>
        <h1 className="mt-2 font-serif text-3xl">Dashboard</h1>
        <label className="mt-6 block text-sm">
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 outline-none focus:border-brand-primary" autoComplete="username" />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 outline-none focus:border-brand-primary" autoComplete="current-password" />
        </label>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={sending} className="mt-6 w-full rounded-full bg-brand-primary py-2.5 text-sm font-bold text-brand-primary-contrast disabled:opacity-60">
          {sending ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}

export default Login
