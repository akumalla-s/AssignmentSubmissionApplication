import React from 'react'
import { useLocalState } from '../util/useLocalStorage';

export default function Dashboard() {
  const [jwt, setJwt] = useLocalState("", "jwt");

  return (
    <div>
      <h1>
        Hello Wolrd
      </h1>
      <div>
        Jwt Value is {jwt}
      </div>
    </div>
  )
}
