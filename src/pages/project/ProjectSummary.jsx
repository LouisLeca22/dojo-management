import Avatar from '../../components/Avatar';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

function ProjectSummary({ project }) {
  const navigate = useNavigate()
  const { user } = useAuthContext();
  const { deleteDocument } = useFirestore('projects');
  const handleDelete = (e) => {
    deleteDocument(project.id);
    navigate("/")
  };
  return (
    <div>
      <div className='project-summary'>
        <h2 className='page-title'>{project.name}</h2>
        <p>Créé par {project.createdBy.displayName}</p>
        <p className='due-date'>
          Échéance du projet : {project.dueDate.toDate().toLocaleDateString()}
        </p>
        <p className='details'>{project.details}</p>
        <h4>Le projet a été assigné à :</h4>
        <div className='assigned-users'>
          {project.assignedUsersList.map((user) => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>
      {user.uid === project.createdBy.id && (
          <button className='btn' onClick={handleDelete}>
            Projet terminé
          </button>
        )}
    </div>
  );
}

export default ProjectSummary;
