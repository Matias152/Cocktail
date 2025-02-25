document.getElementById('apiForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const cocktailName = document.getElementById('cocktailName').value;
    
    if (!cocktailName) {
      alert('Por favor ingrese el nombre de un cóctel.');
      return;
    }
  
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cocktailName })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        mostrarResultado(data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Hubo un problema con la solicitud.');
    }
  });
  
  function mostrarResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    
    if (Array.isArray(data)) {
      let table = `<table><tr><th>Nombre</th><th>Imagen</th><th>Instrucciones</th></tr>`;
  
      data.forEach(item => {
        table += `<tr>
                    <td>${item.strDrink}</td>
                    <td><img src="${item.strDrinkThumb}" alt="${item.strDrink}" width="100"></td>
                    <td>${item.strInstructions}</td>
                  </tr>`;
      });
  
      table += `</table>`;
      resultadoDiv.innerHTML = table;
    } else {
      resultadoDiv.innerHTML = `<p>No se encontraron cócteles con ese nombre.</p>`;
    }
  }
  