import { GraphQLError } from 'graphql';
import { getJobs, getJobsCount, getJob, getJobsByCompany, createJob as createNewJob, deleteJob as deleteOldJob, updateJob as updateOldJob } from './db/jobs.js'
import { getCompany } from './db/companies.js';

export const resolvers = {
    Query: {
        company: async (_root, { id }) => {
            const company = await getCompany(id)
            
            if(!company) throw notFoundError('No company found with id ' + id)

            return company
        },
        job: async (_root, { id }) => {
            const job = await getJob(id)
            
            if(!job) throw notFoundError('No job found with id ' + id)

            return job
        },
        jobs: async (_root, { input = {} }) => {
            const { sort, offset, limit } = input;

            const items = await getJobs({ sort, limit, offset })
            const totalCount = await getJobsCount();
            return { items, totalCount }
        }
    },

    Mutation: {
        createJob: async (_root, { input: { title, description } }, context) => {
            if(!context.user) throw unauthorizedError('Missed authentication')
            
            const { companyId } = context.user
            const createJob = await createNewJob({ companyId, title, description })
            return createJob
        },
        deleteJob: async (_root, { id }, { user }) => {
            if(!user) throw unauthorizedError('Missed authentication')

            const deletedJob = await deleteOldJob(id, user.companyId);

            if(!deletedJob) throw notFoundError('No available job found with id' + id)

            return deletedJob
        },
        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
            if(!user) throw unauthorizedError('Missed authentication')

            const updatedJob = await updateOldJob({ id, title, description, companyId: user.companyId });

            if(!updatedJob) throw notFoundError('No available job found with id' + id)

            return updatedJob
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)  
    },

    Job: {
        date: (job) => job.createdAt.split("T")[0],
        // load bunch of companies
        company: (job, _args, { companyLoader }) => {
            return companyLoader.load(job.companyId) 
        }
    }
}

const notFoundError = (message = '') => {
    return new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" }
    })
}

const unauthorizedError = (message = '') => {
    return new GraphQLError(message, {
        extensions: { code: "UNAUTHORIZED" }
    })
}