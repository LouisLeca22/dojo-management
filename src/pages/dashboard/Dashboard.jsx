import "./dashboard.css"
import {useCollection} from "../../hooks/useCollection"
import ProjectList from "../../components/ProjectList"
import ProjectFilter from "./ProjectFilter"
import { useState } from "react"
import {useAuthContext} from "../../hooks/useAuthContext"

function Dashboard() {
  const {user} = useAuthContext()
  const [currentFilter, setCurrentFilter] = useState("tous")
  const {documents, error} = useCollection("projects")
  
  const changeFIlter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  

  const projects = documents ? documents.filter((document) => {
    switch(currentFilter){
      case "all":
        return true
      case "mes projets":
        let assignedToMe = false 
        document.assignedUsersList.forEach((u) => {
          if(user.uid  === u.id){
            assignedToMe = true
          }
        })
        return assignedToMe
      case "développement": 
      case "design":
      case "marketing":
      case "ventes":
        console.log(document.category, currentFilter)
        return document.category === currentFilter
      default: 
        return true
    }
  }) : null

  return (
    <div>
      <h2 className="page-title">Tableau de bord</h2>
      {error && <p className="error">{error}</p>}
      {documents && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFIlter} />}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}

export default Dashboard