import { route } from 'preact-router'
import { useState } from 'preact/hooks'
import './Home.css'

function Home() {
  const [count, setCount] = useState(0)

  const [name, setName] = useState('')

  // @ts-expect-error just ignore
  const handleChange = (event) => {
    setName(event.target.value || '')
  }

  // @ts-expect-error just ignore
  const handleSubmit = (event) => {
    event.preventDefault()
    if (name)
      route(`/hi/${name}`)
  }

  return (
    <div className="Home">
      <p>
        <button type="button" onClick={() => setCount(count => count + 1)}>
          count is:
          {' '}
          {count}
        </button>
      </p>
      <br />
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={handleChange} type="text" aria-label="What's your name?" placeholder="What's your name?" />
        <button type="submit">GO</button>
      </form>
      <br />
      <a href="/about">About</a>
      <br />
    </div>
  )
}

export default Home
