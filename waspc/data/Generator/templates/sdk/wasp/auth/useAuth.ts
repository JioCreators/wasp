{{={= =}=}}
import { deserialize as superjsonDeserialize } from 'superjson'
import { useQuery, addMetadataToQuery } from 'wasp/client/operations'
import { api, handleApiError } from 'wasp/client/api'
import { HttpMethod } from 'wasp/client'
import type { AuthUser } from '../server/auth/user.js'
import { UseQueryResult } from '@tanstack/react-query'

// PUBLIC API
export const getMe: () => Promise<AuthUser | null> = createUserGetter()

// PUBLIC API
export default function useAuth(queryFnArgs?: unknown, config?: any): UseQueryResult<AuthUser> {
  return useQuery(getMe, queryFnArgs, config)
}  

function createUserGetter() {
  const getMeRelativePath = 'auth/me'
  const getMeRoute = { method: HttpMethod.Get, path: `/${getMeRelativePath}` }
  async function getMe(): Promise<AuthUser | null> {
    try {
      const response = await api.get(getMeRoute.path)
  
      return superjsonDeserialize(response.data)
    } catch (error) {
      if (error.response?.status === 401) {
        return null
      } else {
        handleApiError(error)
      }
    }
  }
  
  addMetadataToQuery(getMe, {
    relativeQueryPath: getMeRelativePath,
    queryRoute: getMeRoute,
    entitiesUsed: {=& entitiesGetMeDependsOn =},
  })

  return getMe
}
