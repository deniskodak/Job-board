import { useQuery, useMutation } from '@apollo/client'
import { getCompanyByIdQuery, getJobsQuery, getJobByIdQuery, createJobMutation } from './queries'
import { useCallback } from 'react';

/**
 * Fetch company by provided Id based on useQuery hook
 */
export const useCompany = (id = '') => {
    const { data, error, loading } = useQuery(getCompanyByIdQuery, { variables: { id }})
    return { company: data?.company, loading, error: Boolean(error) }
}

/**
 * Fetch  jobs based on provided filters
 */
export const useJobs = ({ sort, limit, page }) => {
    const getJobsInput = { sort, limit, offset: limit * page }
    const { data, error, loading } = useQuery(getJobsQuery, { 
        fetchPolicy: 'network-only', 
        variables: { input: getJobsInput }
    })

    return { 
        jobs: data?.jobs.items || [], 
        totalCount: data?.jobs.totalCount || 0, 
        loading, 
        error: Boolean(error)
    }
}

/**
 * Fetch Job by provided Id based on useQuery hook
 */
export const useJob = (jobId = '') => {
    const { data, error, loading } = useQuery(getJobByIdQuery, { variables: { id: jobId }})
    return { job: data?.job, loading, error: Boolean(error) }
}

/**
 * Sends new Job to the API based on useMutation hook
 */
export const useCreateJob = () => {
    const [mutate, { loading, error }] = useMutation(createJobMutation)

    const handleMutate = useCallback(async (title = '', description = '') => {
        const { data } = await mutate({ 
            variables: { input: { title, description } }, 
            update: (cache, result) => {
              cache.writeQuery({ 
                  query: getJobByIdQuery, // query of request we want to prevent,
                  variables: { id: result.data.job['id'] }, // vars of request we want to prevent
                  data: result.data // data we want to cache ( same data will be returned by server for getJobById )
             })
          }});

          return data?.job;
    }, [mutate])

    return {mutate: handleMutate, error: Boolean(error), loading }
}