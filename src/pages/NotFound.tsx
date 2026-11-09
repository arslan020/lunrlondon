import Button from '../components/Button'

function NotFound() {
  return (
    <section className="px-4 py-40 text-center">
      <h1 className="font-serif text-4xl font-medium text-white">404</h1>
      <p className="mt-4 text-neutral-300">The page you're looking for doesn't exist.</p>
      <div className="mt-8">
        <Button to="/">Back to Home</Button>
      </div>
    </section>
  )
}

export default NotFound
