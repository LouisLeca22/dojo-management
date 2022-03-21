
const filterList = ["tous", "mes projets", "développement", "design", "marketing", "ventes"]


function ProjectFilter({currentFilter, changeFilter}) {
  const handleClick = (newFilter) => {
    changeFilter(newFilter)
  }

  return (
    <div className="project-filter">
      <nav>
        <p>Fitré par :</p>
        {filterList.map((f) => (
          <button key={f} onClick={() => handleClick(f)} className={currentFilter === f ? "active" : ""}>
            {f}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default ProjectFilter