import { post } from '@/api/axios'
import api from '@/api/url'


export const updateFirebaseToken = (params: { fireBaseToken?: string; jgToken?: string }): Promise<any> => {
    return post(api.UpdateUserFirebaseToken, params)
}