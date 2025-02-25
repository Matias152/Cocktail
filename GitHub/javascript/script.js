document.getElementById('cocktailForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío del formulario

    const cocktailName = document.getElementById('cocktailInput').value.trim();
    const resultContainer = document.getElementById('resultContainer');

    // Validar si el nombre del cóctel está vacío
    if (cocktailName === "") {
        alert("Por favor, ingresa el nombre de un cóctel.");
        return;
    }

    try {
        // Hacer la petición a la API de TheCocktailDB
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`);
        const data = await response.json();

        // Comprobar si se encontró algún cóctel
        if (data.drinks === null) {
            resultContainer.innerHTML = "<p>No se encontró ningún cóctel con ese nombre.</p>";
        } else {
            // Mostrar los resultados
            showResults(data.drinks);
        }
    } catch (error) {
        resultContainer.innerHTML = `<p>Error al procesar la solicitud. Intenta nuevamente.</p>`;
    }
});

// Mostrar los resultados de los cócteles
function showResults(drinks) {
    const resultContainer = document.getElementById('resultContainer');
    
    // Limpiar cualquier resultado anterior
    resultContainer.innerHTML = '';

    drinks.forEach(drink => {
        const drinkCard = document.createElement('div');
        drinkCard.classList.add('drink-card');

        const drinkHtml = `
            <h4>${drink.strDrink}</h4>
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <p><strong>Categoría:</strong> ${drink.strCategory}</p>
            <p><strong>Instrucciones:</strong> ${drink.strInstructions}</p>
            <h5>Ingredientes:</h5>
            <ul>
                <li>${drink.strIngredient1 ? `${drink.strIngredient1}: ${drink.strMeasure1}` : ''}</li>
                <li>${drink.strIngredient2 ? `${drink.strIngredient2}: ${drink.strMeasure2}` : ''}</li>
                <li>${drink.strIngredient3 ? `${drink.strIngredient3}: ${drink.strMeasure3}` : ''}</li>
                <li>${drink.strIngredient4 ? `${drink.strIngredient4}: ${drink.strMeasure4}` : ''}</li>
                <li>${drink.strIngredient5 ? `${drink.strIngredient5}: ${drink.strMeasure5}` : ''}</li>
                <li>${drink.strIngredient6 ? `${drink.strIngredient6}: ${drink.strMeasure6}` : ''}</li>
            </ul>
        `;

        drinkCard.innerHTML = drinkHtml;
        resultContainer.appendChild(drinkCard);
    });
}
