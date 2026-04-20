import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const locationsList = [
  {label: 'Hyderabad', locationId: 'HYDERABAD'},
  {label: 'Bangalore', locationId: 'BANGALORE'},
  {label: 'Chennai', locationId: 'CHENNAI'},
  {label: 'Delhi', locationId: 'DELHI'},
  {label: 'Mumbai', locationId: 'MUMBAI'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employeeTypeList: [],
    minimumSalary: '',
    searchInput: '',
    selectedLocations: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {employeeTypeList, minimumSalary, searchInput, selectedLocations} =
      this.state
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeTypeList.join()}&minimum_package=${minimumSalary}&search=${searchInput}&location=${selectedLocations.join()}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedJobs = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: formattedJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeLocation = locationId => {
    const {selectedLocations} = this.state
    const isAlreadyPresent = selectedLocations.includes(locationId)

    if (isAlreadyPresent) {
      this.setState(
        prevState => ({
          selectedLocations: prevState.selectedLocations.filter(
            id => id !== locationId,
          ),
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          selectedLocations: [...prevState.selectedLocations, locationId],
        }),
        this.getJobs,
      )
    }
  }

  changeSalary = salaryRangeId => {
    this.setState({minimumSalary: salaryRangeId}, this.getJobs)
  }

  changeEmployeeList = type => {
    const {employeeTypeList} = this.state
    const isTypePresent = employeeTypeList.includes(type)

    if (isTypePresent) {
      this.setState(
        prevState => ({
          employeeTypeList: prevState.employeeTypeList.filter(
            id => id !== type,
          ),
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employeeTypeList: [...prevState.employeeTypeList, type],
        }),
        this.getJobs,
      )
    }
  }

  onSearchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  renderNoJobsFoundView = () => (
    <div className='no-jobs-view'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
        alt='no jobs'
        className='no-jobs-img'
      />
      <h1 className='no-jobs-heading'>No Jobs Found</h1>
      <p className='no-jobs-description'>
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const jobsCount = jobsList.length

    return jobsCount > 0 ? (
      <ul className='jobs-list'>
        {jobsList.map(each => (
          <JobCard jobData={each} key={each.id} />
        ))}
      </ul>
    ) : (
      this.renderNoJobsFoundView()
    )
  }

  renderJobsFailureView = () => (
    <div className='jobs-error-view-container'>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
        alt='failure view'
        className='jobs-failure-img'
      />
      <h1 className='jobs-failure-heading-text'>Oops! Something Went Wrong</h1>
      <p className='jobs-failure-description'>
        We cannot seem to find the page you are looking for
      </p>
      <button
        type='button'
        className='jobs-failure-button'
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
    </div>
  )

  renderJobsContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className='jobs-container'>
          <div className='jobs-content'>
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              locationsList={locationsList}
              changeSearchInput={this.onSearchChange}
              searchInput={searchInput}
              getJobs={this.getJobs}
              changeSalary={this.changeSalary}
              changeEmployeeList={this.changeEmployeeList}
              changeLocation={this.changeLocation}
            />
            <div className='search-input-jobs-list-container'>
              <div className='search-input-container-desktop'>
                <input
                  type='search'
                  className='search-input-desktop'
                  placeholder='Search'
                  value={searchInput}
                  onChange={this.onSearchChange}
                  onKeyDown={this.onKeyDownSearch}
                />
                <button
                  type='button'
                  data-testid='searchButton'
                  className='search-button-container-desktop'
                  onClick={this.getJobs}
                >
                  <BsSearch className='search-icon-desktop' />
                </button>
              </div>
              {this.renderJobsContent()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
