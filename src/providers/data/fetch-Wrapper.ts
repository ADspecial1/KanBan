import { GraphQLFormattedError } from 'graphql';

type Error = {
    message: string;
    statusCode: string;
}

const customFetch = async (url : string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access_token');

    const headers = options.headers as Record<string, string>

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "Application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>):
Error | null =>{
    if(!body){
        return{
            message: 'Unknown error',
            statusCode : "INTERNAL_SERVER_ERROR"
        }
    }

    if("error" in body){
        const errors = body?.errors;

        const messages = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code;

        return{
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }

    return null;
}

export const fetchWrapper =  async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);

    const responseClone = response.clone();
    const body = await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error) {
        throw error;
    }

    return response;
}

// import { GraphQLFormattedError } from 'graphql';

// type Error = {
//     message: string;
//     statusCode: string;
// }

// const customFetch = async (url: string, options: RequestInit) => {
//     const accessToken = localStorage.getItem('access_token');

//     const headers = options.headers as Record<string, string>

//     return await fetch(url, {
//         ...options,
//         headers: {
//             ...headers,
//             Authorization: headers?.Authorization || `Bearer ${accessToken}`,
//             "Content-Type": "Application/json",
//             "Apollo-Require-Preflight": "true",
//         }
//     })
// }

// const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
//     if (!body) {
//         return {
//             message: 'Unknown error',
//             statusCode: "INTERNAL_SERVER_ERROR"
//         }
//     }

//     if ("errors" in body) {
//         const errors = body?.errors;

//         const messages = errors?.map((error) => error?.message)?.join("");
//         const code = errors?.[0]?.extensions?.code;

//         return {
//             message: messages || JSON.stringify(errors),
//             statusCode: code || 500
//         }
//     }

//     return null;
// }

// export const fetchWrapper = async (url: string, options: RequestInit) => {
//     try {
//         const response = await customFetch(url, options);

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const responseClone = response.clone();
//         const body = await responseClone.json();

//         // Validate response structure
//         if (!body || typeof body !== 'object') {
//             throw new Error('Invalid response structure');
//         }

//         const error = getGraphQLErrors(body);

//         if (error) {
//             throw error;
//         }

//         // Ensure data property exists
//         if (!body.data) {
//             throw new Error('Response missing required data property');
//         }

//         return body.data; // Return only the data portion
//     } catch (error) {
//         console.error('Fetch error:', error);
//         throw error;
//     }
// }