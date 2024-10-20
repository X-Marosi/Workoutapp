import axios from 'axios';
import { rapidApiKey } from '@/constants/exercise';

const baseUrl = 'https://exercisedb.p.rapidapi.com/';

const apiCall = async (url: string, params: object) => {
    try {
        const response = await axios.get(url, {
            params: params,
            headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        });
        
        return response.data;

    } catch (error) {
        console.error(error);
    }
}

export const fetchExercises = async () => {
    const url = baseUrl + 'exercises';
    const params = {
        limit: 1400
    }


    const data = await apiCall(url, params);
    //console.log(data);
    return data;
}