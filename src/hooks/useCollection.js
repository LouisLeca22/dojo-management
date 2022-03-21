import {useState, useEffect, useRef} from "react"
import {db} from "../firebase/config"
import {collection, onSnapshot, query, orderBy, where} from "firebase/firestore"


export const useCollection = (c, _q, _o) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  const q = useRef(_q).current
  const o = useRef(_o).current

  useEffect(() => {
    let ref = collection(db, c)

    if (q) {
      ref = query(collection(db, c), where(...q))
    }

    if(o){
      ref = query(collection(db, c), orderBy(...o))
    }

    if(q && o){
      ref = query(collection(db, c), where(...q), orderBy(...o))
    }


    const unsub = onSnapshot(ref, (snapshot) => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({...doc.data(), id: doc.id})
      })
      setDocuments(results)
      setError(null)
    }, (error) => {
      console.log(error)
      setError("could not fetch the data")
    })

    return () => unsub()
  }, [c, q, o])

  return {documents}
}