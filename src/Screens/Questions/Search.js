const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');

export default async function SearchImageUrl(query_keyword) {
    try {
        const full_query =  query_keyword + '.jpg or png';
        const test = await GOOGLE_IMG_SCRAP({
            search: full_query,
            domain: ['istockphoto.com/photos/vegetable'],
            limit: 1
        });
        return test; 
    }
    catch (error) {
        console.error('Error occurred:', error);
        throw error; 
    }
}