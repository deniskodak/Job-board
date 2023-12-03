import { useParams } from 'react-router';
import { useCompany } from '../lib/graphql/hooks';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  const { company, error, loading } = useCompany(companyId);
  
  return (
    <>
    {error && <div className="has-text-danger">An error ocurred, please try another Company</div>}
    {loading && <div>Loading...</div>}
    {company && 
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="title is-5">Jobs at {company.name}: </h2>
      <JobList jobs={company.jobs} ></JobList>
    </div>
    }
    </>

  );
}

export default CompanyPage;
