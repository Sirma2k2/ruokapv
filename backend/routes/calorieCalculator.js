const calculateCalories = (user) => { //backend hook to calculate calories
    const { ika, paino, pituus, aktiviteetti, tyyppi, tavoite, sukupuoli } = user;
  
    const bmr = sukupuoli === 'male'
      ? 10 * paino + 6.25 * pituus - 5 * ika + 5 // BMR for men
      : 10 * paino + 6.25 * pituus - 5 * ika - 161; // BMR for women
  
    const activityMultiplier = aktiviteetti === 1 ? 1.2 : aktiviteetti === 2 ? 1.55 : 1.9; 
    const goalMultiplier = tavoite === 1 ? 0.8 : tavoite === 2 ? 1 : 1.2; 
  
    const goalCalories = bmr * activityMultiplier * goalMultiplier;
    const foodCalories = 0; // Initialize food calories to 0
    const remainingCalories = goalCalories - foodCalories;
  
    return {
      goal: goalCalories,
      food: foodCalories,
      remaining: remainingCalories,
    };
  };
  
  module.exports = calculateCalories;