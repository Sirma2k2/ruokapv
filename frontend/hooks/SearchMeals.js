import ServerIp from '../hooks/Global';

export const SearchMeals = async (username, query) => {
    console.log('Headers sent to server:', {
        knimi: username,
        searchterm: query,
    });

    try {
        // Lähetetään GET-pyyntö
        const response = await fetch(ServerIp + '/api/search-meals', {
            headers: {
                knimi: username,
                searchterm: query,
            }

        });
        
        if (!response.ok) {
            console.log("not ok maybe not found");
        }

        return response;

    } catch (error) {
        console.log('Error searching meal', error);
        return error;
    }

  };
