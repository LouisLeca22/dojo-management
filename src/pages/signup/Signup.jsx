import { useState } from 'react';
import './signup.css';
import AddIcon from '../../assets/add_icon.svg';
import {useSignup} from "../../hooks/useSignup"

function Signup() {
  const {signup, isPending, error} = useSignup()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...formData, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setThumbnail(null)
    let selected = e.target.files[0]
    if(!selected){
      setThumbnailError("Choisissez une image")
      return
    }

    if(!selected.type.includes("image")){
      setThumbnailError("Vous devez importer une image")
      return
    } 

    if(!selected.size > 100000){
      setThumbnailError("La taille de l'image dépasse 100kb")
      return
    }
    setThumbnailError(null)
    setThumbnail(selected)
    console.log("thumbnail updated")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(formData, thumbnail)
  }
  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Créer un compte</h2>
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
      <label>
        <span>Nom d'utilisateur</span>
        <input
          type='text'
          name='displayName'
          onChange={handleChange}
          value={formData.displayName}
        />
      </label>
      <label>
        <span>Avatar</span>
        <img
          src={AddIcon}
          alt='add button'
          style={{
            width: '50px',
            height: '50px',
            border: '1px dashed #ddd',
            filter:
              'invert(43%) sepia(43%) saturate(2756%) hue-rotate(230deg) brightness(97%) contrast(95%)',
          }}
        />
        <input type='file' style={{ display: 'none' }} onChange={handleFileChange} />
        {thumbnailError && <div className='error'>{thumbnailError}</div>}
      </label>
      {isPending && <button className='btn' disabled>Chargement</button>}
      {!isPending &&  <button className='btn'>Créer un compte</button> }
      {error && <div className='error'>{error}</div>}
    </form>
  );
}

export default Signup;
