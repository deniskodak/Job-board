import { ApolloClient, ApolloLink, InMemoryCache, concat, createHttpLink, gql } from '@apollo/client'
import { getAccessToken } from '../auth';
import { API_URL } from '../api';
import { graphql } from '../../generated/gql';

const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken();

    token && operation.setContext(({
        headers: { 'Authorization': "Bearer " + token }
    }))

    return forward(operation)
})

const httpLink = createHttpLink({ uri: `${API_URL}graphql` });

export const apolloClient = new ApolloClient({ cache: new InMemoryCache(), link: concat(authLink, httpLink),
    defaultOptions: {
        query: { fetchPolicy: "cache-first" }, 
        watchQuery: { fetchPolicy: "cache-first" } // for React hooks
    }
});

export const JobDetailFragment = graphql(`
    fragment JobDetail on Job {
        id
        date
        description
        title
        company {
            id
            name
        }
    }
`);

export const getJobsQuery = graphql(`
query getAllJobs($input: GetJobsInput) {
    jobs(input: $input) {
        items {
            ...JobDetail
        }
        totalCount
    }
  }
`);

export const getJobByIdQuery = graphql(`
query getJobById($id: ID!) {
    job(id: $id) {
        ...JobDetail
    }
}
`);


export const getCompanyByIdQuery = graphql(`
query getCompanyById($id: ID!) {
    company(id: $id) {
        id
        name
        description
        jobs {
            title
            id
            description
            date
        }
    }
}
`);

export const createJobMutation = graphql(`
mutation createJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
        ...JobDetail
    }
}
`);

export const getJobs = async () => {
    const { data } = await apolloClient.query({ query: getJobsQuery , fetchPolicy: 'network-only'})
    return data.jobs;
}

export const getJobById = async (jobId) => {
    const { data } = await apolloClient.query({ query: getJobByIdQuery, variables: { id: jobId }})
    return data.job
}

export const createJob = async ({ title = '', description = '' }) => {
    // extended for caching
    const { data } = await apolloClient.mutate({ mutation: createJobMutation, variables: { input: { title, description } }, update: (cache, result) => {
        cache.writeQuery({ 
            query: getJobByIdQuery, // query of request we want to prevent,
            variables: { id: result.data.job['id'] }, // vars of request we want to prevent
            data: result.data // data we want to cache ( same structure as it would be returned by server for getJobById )
         })
    }})
    return data.job
}

export const getCompanyById = async (companyId) => {
    const { data } = await apolloClient.query({ query: getCompanyByIdQuery, variables: { id: companyId }, fetchPolicy: 'network-only'})
    return data.company
}