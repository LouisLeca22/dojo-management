import "./project.css"
import {useParams} from "react-router-dom"
import {useDocument} from "../../hooks/useDocument"
import ProjectSummary from "./ProjectSummary"
import ProjectComments from "./ProjectComments"

function Project() {
  const {id} = useParams()
  const {error, document} = useDocument("projects", id)

  if(error){
    return <div className="error">{error}</div>
  }

  if(!document){
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="project-details">
      <ProjectSummary project={document}/>
      <ProjectComments project={document}/>
    </div>
  )
}

export default Project