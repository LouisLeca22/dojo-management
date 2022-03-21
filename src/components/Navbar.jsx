import './navbar.css';
import Temple from '../assets/temple.svg';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

function Navbar() {
  const { user } = useAuthContext();
  const { logout, isPending } = useLogout();
  return (
    <div className='navbar'>
      <ul>
        <li className='logo'>
          <img src={Temple} alt='logo' />
          <span>Dojo management</span>
        </li>
        {user && (
          <li>
            {isPending && (
              <button className='btn' disabled>
                Chargement
              </button>
            )}
            <button className='btn' onClick={logout}>
              Déconnexion
            </button>
          </li>
        )}
        {!user && (
          <>
            <li>
              <Link to='/login'>Se connecter</Link>
            </li>
            <li>
              <Link to='/signup'>Créer un compte</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
