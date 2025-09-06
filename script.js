async function searchRecipe() {
  const query = document.getElementById("searchInput").value;
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    recipeList.innerHTML = "";

    if (!data.meals) {
      recipeList.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <button class="view-btn" onclick="viewRecipe('${meal.idMeal}')">View Recipe</button>
      `;

      recipeList.appendChild(card);
    });
  } catch (error) {
    recipeList.innerHTML = "<p>Error fetching recipes.</p>";
  }
}

async function viewRecipe(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
  }

  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = `
    <div class="recipe-card">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2>${meal.strMeal}</h2>
      <h3>Ingredients</h3>
      <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
      <button onclick="searchRecipe()">🔙 Back</button>
    </div>
  `;
}

