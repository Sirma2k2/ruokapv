import ServerIp from '../hooks/Global';

export const SaveFood = async (food, ateria, username, consumedAmount) => {
    console.log("CALLED SAVE FOOD");
    if (!consumedAmount || isNaN(consumedAmount) || consumedAmount <= 0) {
        Alert.alert("Error", "Please enter a valid amount in grams.");
        return;
      }

    const proteinPerGram = food.nutriments?.proteins_100g || 0;
    const carbsPerGram = food.nutriments?.carbohydrates_100g || 0;
    const fatPerGram = food.nutriments?.fat_100g || 0;
    const caloriesPerGram = food.nutriments?.['energy-kcal'] || 0;
    const image = food.image_small_url
    const proteinAmount = (proteinPerGram * consumedAmount) / 100;
    const carbsAmount = (carbsPerGram * consumedAmount) / 100;
    const fatAmount = (fatPerGram * consumedAmount) / 100;
    const caloriesAmount = (caloriesPerGram * consumedAmount) / 100;
    
    const foodData = {
        knimi: username, 
        ruokanimi: food?.product_name || food.brands || "N/A",
        tyyppi: ateria,
        maarag: consumedAmount,
        kalorit: Math.round(caloriesAmount),
        proteiini: Math.round(proteinAmount),
        hiilihydraatit: Math.round(carbsAmount),
        rasvat: Math.round(fatAmount),
        picture: image
    };

    try {
    // Lähetetään POST-pyyntö
    const response = await fetch(ServerIp + '/api/add-food', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
    });
    
    if (!response.ok) {
        console.log("response != ok");
        throw new Error('Failed to save food to the database');
    }

    return response;

    } catch (error) {
        console.error('Error saving food:', error);
        return error;
    }

  };