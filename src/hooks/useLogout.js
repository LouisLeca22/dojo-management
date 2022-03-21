import { useEffect, useState } from 'react';
import { auth, db} from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { signOut } from 'firebase/auth';
import {doc, updateDoc} from "firebase/firestore"

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user} = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);
    try {

      // update online status 
      const {uid} = user
      const ref = doc(db, "users", uid)
      await updateDoc(ref, {online: false})

      await signOut(auth);

      dispatch({ type: 'LOGOUT' });
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if(!isCancelled){
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
