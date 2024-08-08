import Axios from "axios";

async function getAllDataFromCollection() {
    try {

        const response = await Axios.get("http://localhost:3000/collection/collection-data");
        return response.data ; // Return all datas in collection

    } catch (error) {
        console.log('Error:', error); // Log the error
        throw error; // Rethrow error to propagate it to the caller
    }
}

export default getAllDataFromCollection;