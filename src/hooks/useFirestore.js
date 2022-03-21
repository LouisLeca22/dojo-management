import { useReducer, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

let initialState = {
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null };
    case 'ADDED_DOCUMENT':
      return {
        success: true,
        isPending: false,
        error: null,
      };
    case 'DELETED_DOCUMENT':
      return { isPedning: false, success: true, error: null };
    case 'UPDATED_DOCUMENT':
      return {
        isPending: false,
        success: true,
        error: null,
      };
    case 'ERROR':
      return {
        isPedning: false,
        succes: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const useFirestore = (c) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  
  const ref = collection(db, c);

  function dispatchIfNotCancelled(action) {
    if (!isCancelled) {
      dispatch(action);
    }
  }

  // Add document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const createdAt = Timestamp.fromDate(new Date());
     await addDoc(ref, { ...doc, createdAt });
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT'});
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: "Impossible d'ajouter" });
    }
  };

  // delete document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      await deleteDoc(doc(ref, id));
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT'});
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'Impossible de supprimer' });
    }
  };

  // update document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      await updateDoc(doc(ref, id), updates);
      dispatchIfNotCancelled({
        type: 'UPDATED_DOCUMENT'
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'Impossible de mettre à jour' });
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);


  return { addDocument, deleteDocument, updateDocument, response };
};
