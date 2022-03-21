import { Link } from 'react-router-dom';
import './projectlist.css';
import Avatar from "./Avatar"

function ProjectList({ projects }) {
  
  return (
    <div className='project-list'>
      {projects.length === 0 && <p>Aucun projet pour le moment</p>}
      {projects.map((project) => (
        <Link key={project.id} to={`/projects/${project.id}`}>
          <h4>{project.name}</h4>
          <p>Échéance : {project.dueDate.toDate().toLocaleDateString()}</p>
          <div className='assigned-to'>
            <ul>
              {project.assignedUsersList.map((user) => (
                <li key={user.photoURL}>
                  <Avatar src={user.photoURL}/>
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProjectList;
