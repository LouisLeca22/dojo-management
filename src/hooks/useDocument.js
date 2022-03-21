import { useEffect, useState } from "react"
import {db} from "../firebase/config"
import { collection, doc, onSnapshot} from "firebase/firestore"

export const useDocument = (col, id ) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = doc(collection(db, col), id)
    const unsub = onSnapshot(ref, (snapshot) => {
      if(snapshot.data()){
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      } else {
        setError("Le document n'existe pas")
      }
    
    }, (error) => {
      console.log(error.message)
      setError("Impossible de charger le document")
    })

    return () => unsub()

  }, [collection, id])

  return {document, error}
}