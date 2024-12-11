import ServerIp from '../hooks/Global';

export const SearchMeals = async (username, query) => {
    console.log('Headers sent to server:', {
        knimi: username,
        searchTerm: query,
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
            throw new Error('Response not ok: ', response);
        }

        return response;

    } catch (error) {
        console.error('Error searching meal', error);
        return error;
    }

  };
