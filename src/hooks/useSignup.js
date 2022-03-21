import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { auth, storage, db} from '../firebase/config';
import {setDoc, doc} from "firebase/firestore"
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';


export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const [isCancelled, setIsCancelled] = useState(false);

  const signup = async (formData, thumbnail) => {
    const { email, password, displayName } = formData;
    setError(null);
    setIsPending(true);

    try {
      //signup 
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) {
        throw new Error('Could not complete this signup');
      }

      //upload image
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const storageRef = ref(storage, uploadPath)
      const uploadTask = uploadBytesResumable(storageRef, thumbnail)
  

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default: 
              console.log("default");
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
            default:
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateUserInfo(downloadURL)
            addUserToDb(downloadURL)
          });
        }
      );
      
      //Update user with display name and img>Url
      const updateUserInfo = async (imgUrl) => {
        await updateProfile(res.user, { displayName, photoURL: imgUrl});
      }
      
      // Add user to db 
      const addUserToDb = async (imgUrl) => {
        await setDoc(doc(db, "users", res.user.uid), {displayName, online: true, photoURL: imgUrl } )
      }

      // dispatch login 
      dispatch({ type: 'LOGIN', payload: res.user });

      console.log(isCancelled)

      //update state
      if (!isCancelled) {
        setIsPending(false);
        console.log(isPending)
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { error, isPending, signup };
};
