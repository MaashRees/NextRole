import { useState } from 'react'
function Router() {
  const [count, setCount] = useState(0)

  return (
    <div class="text-3xl font-bold underline">
      Bienvenue sur NextRoute
    </div>
  )
}

export default Router
