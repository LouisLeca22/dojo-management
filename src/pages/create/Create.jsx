import { useEffect, useState } from 'react';
import './create.css';
import Select from 'react-select';
import { useCollection } from '../../hooks/useCollection';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'développement', label: 'Développement' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ventes', label: 'Ventes' },
];

function Create() {
  const navigate = useNavigate()
  const {user} = useAuthContext()
  const { documents } = useCollection('users');
  const {addDocument, response} = useFirestore("projects")

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [users, setUsers] = useState([]);
  const [formError, setFormError] = useState(null);
  const [category, setCategory] = useState('');
  const [assginedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    if (documents) {
      const options = documents.map((document) => ({
        value: document,
        label: document.displayName,
      }));
      setUsers(options);
    }
  }, [documents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!category) {
      setFormError('Choisissez une catégorie pour le projet');
      return;
    }

    if (assginedUsers.length < 1) {
      setFormError('Assignez au moins une personne au projet');
      return;
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const assignedUsersList = assginedUsers.map(u => ({displayName: u.value.displayName, photoURL: u.value.photoURL, id: u.value.id}))

    const project = {
      name,
      details,
      category: category.value,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList
    };

   await addDocument(project)
   if(!response.error){
     navigate("/")
   }
  };



  return (
    <div className='create-form'>
      <h2 className='page-title'>Créer un nouveau projet</h2>
      {formError && <p className='error'>{formError}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nom du projet</span>
          <input
            type='text'
            name='name'
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </label>
        <label>
          <span>Détails</span>
          <textarea
            type='text'
            name='details'
            onChange={(e) => setDetails(e.target.value)}
            value={details}
            required
          ></textarea>
        </label>
        <label>
          <span>Échéance</span>
          <input
            type='date'
            name='dueDate'
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
            required
          />
        </label>
        <label>
          <span>Catégories</span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        <label>
          <span>Assigné à </span>
          <Select
            options={users}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>
        <button className='btn'>Ajouter un projet</button>
      </form>
    </div>
  );
}

export default Create;
