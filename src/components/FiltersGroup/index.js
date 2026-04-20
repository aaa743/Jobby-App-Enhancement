import {BsSearch} from 'react-icons/bs'
import ProfileDetails from '../ProfileDetails'
import './index.css'

const FiltersGroup = props => {
  const {
    getJobs,
    searchInput,
    changeSearchInput,
    employmentTypesList,
    changeEmployeeList,
    salaryRangesList,
    changeSalary,
    locationsList,
    changeLocation,
  } = props

  const onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const renderSearchFilter = () => (
    <div className="search-input-container">
      <input
        type="search"
        className="search-input"
        placeholder="Search"
        value={searchInput}
        onChange={changeSearchInput}
        onKeyDown={onKeyDownSearchInput}
      />
      <button
        type="button"
        data-testid="searchButton"
        className="search-button-container"
        onClick={getJobs}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  const renderEmploymentTypeFilter = () => (
    <div className="employment-type-container">
      <h1 className="employment-type-heading">Type of Employment</h1>
      <ul className="employee-type-list-container">
        {employmentTypesList.map(eachType => (
          <li className="employee-item" key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              className="check-input"
              value={eachType.employmentTypeId}
              onChange={() => changeEmployeeList(eachType.employmentTypeId)}
            />
            <label htmlFor={eachType.employmentTypeId} className="check-label">
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderSalaryRangeFilter = () => (
    <div className="salary-range-container">
      <h1 className="salary-range-heading">Salary Range</h1>
      <ul className="salary-range-list-container">
        {salaryRangesList.map(eachSalary => (
          <li className="salary-item" key={eachSalary.salaryRangeId}>
            <input
              type="radio"
              id={eachSalary.salaryRangeId}
              name="salary"
              className="check-input"
              onChange={() => changeSalary(eachSalary.salaryRangeId)}
            />
            <label htmlFor={eachSalary.salaryRangeId} className="check-label">
              {eachSalary.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderLocationFilter = () => (
    <div className="location-container">
      <h1 className="location-heading">Location</h1>
      <ul className="location-list-container">
        {locationsList.map(eachLoc => (
          <li className="location-item" key={eachLoc.locationId}>
            <input
              type="checkbox"
              className="check-input"
              // TEST CASE 96 FIX: ఇక్కడ id తప్పనిసరిగా label కి సమానంగా ఉండాలి
              id={eachLoc.label} 
              value={eachLoc.locationId}
              onChange={() => changeLocation(eachLoc.locationId)}
            />
            <label htmlFor={eachLoc.label} className="check-label">
              {eachLoc.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="filters-group-container">
      {renderSearchFilter()}
      <ProfileDetails />
      <hr className="horizontal-line" />
      {renderEmploymentTypeFilter()}
      <hr className="horizontal-line" />
      {renderSalaryRangeFilter()}
      <hr className="horizontal-line" />
      {renderLocationFilter()}
    </div>
  )
}

export default FiltersGroup