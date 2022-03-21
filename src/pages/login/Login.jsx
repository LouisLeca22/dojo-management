import { useState } from 'react';
import './login.css';
import {useLogin} from "../../hooks/useLogin"

function Login() {
  const [formData, setFormaData] = useState({
    email: "",
    password: ""
  })

  const {login, isPending, error} = useLogin()

  const handleChange = (e) => {
    setFormaData(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)

  }
  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Se connecter</h2>
      <label>
        <span>E-mail</span>
        <input
          type='email'
          name='email'
          onChange={handleChange}
          value={formData.email}
        />
      </label>
      <label>
        <span>Mot de passe</span>
        <input
          type='password'
          name='password'
          onChange={handleChange}
          value={formData.password}
        />
      </label>
      {isPending && (
        <button className='btn' disabled>
          Chargement
        </button>
      )}
      {!isPending && <button className='btn'>Se connecter</button>}
      {error && <div className='error'>{error}</div>}
    </form>
  );
}

export default Login;
