import React from 'react'

export default function Login() {
  return (
    <>
      <div>
        <label htmlFor='username'>Username: </label>
        <input type="text" id='username'/>
      </div>
      <div>
        <label htmlFor='password'>Password: </label>
        <input type="password" id='password'/>
      </div>
    </>
  )
}
