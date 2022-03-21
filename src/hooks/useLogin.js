import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {doc, updateDoc} from "firebase/firestore"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (formData) => {
    const {email, password} = formData
    setError(null);
    setIsPending(true);
    try {
     const res = await signInWithEmailAndPassword(auth, email, password);
     
     // update online status
     const ref = doc(db, "users", res.user.uid)
     await updateDoc(ref, {online: true})

      dispatch({ type: 'LOGIN', payload: res.user });
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

  return { login, error, isPending };
};
