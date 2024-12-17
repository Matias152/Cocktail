var firstTrip = true;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('footer').classList.add('loadedFooter', 'NoResults');
    document.getElementById('buscador').addEventListener('submit', encontrarBuscador);
    document.getElementById('category').addEventListener('change', switchCategory);
    cargarEntrada();
});

/**
 * Carga la categoría general deseada, o las bebidas por defecto, de la API.
 * Encontrada al cargar la página y al cambiar categorías.
 * @param type - String. El valor de tipo de fetch a hacer (bebidas populares, ingredientes populares, últimas bebidas, ingredientes al azar, bebidas al azar) (tragos).
 * @async
 */

async function cargarEntrada(type = 'tragos') {
   console.clear();
   const data = await index(type, false);
    if (data === -1) {
        let msg;
        switch (type) {
            case 'bebidas populares':
                msg = 'Error al obtener las bebidas populares.';
                break;
            case 'ingredientes populares':
                msg = 'Error al obtener los ingredientes populares.';
                break;
            case 'últimas bebidas':
                msg = 'Error al obtener las últimas bebidas.';
                break;
            case 'ingredientes al azar':
                msg = 'Error al obtener los ingredientes al azar.';
                break;
            case 'bebidas al azar':
                msg = 'Error al obtener las bebidas al azar.';
                break;
            default:
                msg = 'Error al cargar.';
                break;
            }
            generarError(msg, document.getElementById('listado'));
            return;
    }
    if (firstTrip) {
        Copyright(data);
        moveFooter(true);
        firstTrip = false;
    }
    switch (type) {
        case 'bebidas populares':
            generarBebidas(data);
            break;
        case '':
            generarIngredientes(data);
            break;
        case 'ingredientes populares':
            switchAble(false);  //TEMP.
            // generarIngredientes(data);
            // TODO
            break;
        case 'últimas bebidas':
            switchAble(false);  //TEMP.
            // generarBebidas(data);
            // TODO
            break;
        case 'ingredientes al azar':
            switchAble(false);  //TEMP.
            // generarIngredientes(data);
            // TODO
            break;
        case 'bebidas al azar':
            switchAble(false);  //TEMP.
            // generarBebidas(data);
            // TODO
            break;
        default:
            break;
    }
}

/**
 * Habilita o deshabilita todos los campos de todos los formularios de búsqueda.
 * 
 * Pensar en: "¿Debo querer el atributo disabled?"
 * @param bloquear - Bool. True para deshabilitar, false para habilitar (true).
 */
function switchAble(bloquear = true) {
    const inputs_formulario = document.getElementById('buscador').querySelectorAll('input');
    const selects_formulario = document.getElementById('buscador').querySelectorAll('select');
    const category_select = document.getElementById('category');

    const lista = [...inputs_formulario, ...selects_formulario, category_select];

    lista.forEach(element => {
        element.disabled = bloquear;
        return bloquear;
    });
}

/**
 * Generar elementos de bebidas para el listado según la respuesta de la API.
 * @param {Promise} data - Objeto que contiene la respuesta inmediata de la API.
 */
function generarBebidasPopulares(data) {
    const listado = document.getElementById('listado');
    const resultados_index = document.getElementById('resultados');
    const results = data.data.results;
    if (results.length === 0) {
        resultados_index.textContent = '';
        listado.innerHTML = '';
        generarError('No se encontraron bebidas populares.', listado);
        switchAble(false);
        return;
    }
    listado.innerHTML = '';
    results.forEach(function (_bebida) {
        const article = document.createElement('article');
        article.className = 'bebida_banner';

        const img = document.createElement('img');
        img.className = 'bebida_img';

        const a = document.createElement('a');
        a.className = 'bebida_name';

        // const br = document.createElement('br');
        img.src = `${_bebida.thumbnail.path}.${_bebida.thumbnail.extension}`;
        img.alt = _bebida.name;
        a.textContent = _bebida.name;
        a.href = `/bebida?id=${_bebida.id}`;

        article.appendChild(img);
        // article.appendChild(br);
        article.appendChild(a);
        listado.appendChild(article);

    });
    resultados_index.textContent = 'Resultados: ' + (data.data.offset + 1) + ' - ' + (data.data.count + data.data.offset) + "/" + (data.data.total);
    switchAble(false);
}

/**
 * Se genera los elementos de los ingredientes populares para el listado según la respuesta de la API.
 * @param {Promise} data - Objeto que contiene la respuesta inmediata de la API.
 */
function generarIngredientesPopulares(data) {
    const listado = document.getElementById('listado');
    const resultados_index = document.getElementById('resultados');
    const results = data.data.results;
    if (results.length === 0) {
        resultados_index.textContent = '';
        listado.innerHTML = '';
        generarError('No se encontraron ingredientes populares.', listado);
        switchAble(false);
        return;
    }
    listado.innerHTML = '';
    results.forEach(_ingrediente => {
        const article = document.createElement('article');
        article.className = 'ingrediente_banner';

        const img = document.createElement('img');
        img.className = 'ingrediente_img';

        const a = document.createElement('a');
        a.className = 'ingrediente_title';

        img.src = _ingrediente.thumbnail.path + '.' + _ingrediente.thumbnail.extension;
        img.alt = _ingrediente.title;
        a.textContent = _ingrediente.title;
        a.href = '/ingrediente' + '?id=' + _ingrediente.id;

        article.appendChild(img);
        article.appendChild(a);
        listado.appendChild(article);
    });
    resultados_index.textContent = 'Resultados: ' + (data.data.offset + 1) + ' - ' + (data.data.count + data.data.offset) + "/" + (data.data.total);
    switchAble(false);
}

/**
 * Se encuentra la función de validación y búsqueda correspondiente según la categoría seleccionada en el select.
 * @param {Event} e - Evento de submit del formulario.
 */
function encontrarBuscador(e) {
    e.preventDefault();
    const category = document.getElementById('category').value;
    console.clear();
    console.log("Buscando en la categoría: " + category);
    switch (category) {
        case 'bebidas populares':
            buscarBebidasPopulares(e);
            break;
        case 'ingredientes populares':
            generarIngredientesPopulares(e);
            break;
        case 'últimas bebidas':
            // buscarÚltimasBebidas(e);
            // TODO
            break;
        case 'ingredientes al azar':
            // buscarIngredientesAlAzar(e);
            // TODO
            break;
        case 'bebidas al azar':
            // buscarBebidasAlAzar(e);
            break;
        default:
            console.log('Error de entrada. Categoría no reconocida.');
            break;
    }
}

/**
 * Buscan las Bebidas populares en la API de Marvel según los campos del formulario.
 * @param {Event} e - Evento submit del formulario.
 * @async
 */
async function buscarBebidasPopulares(e) {
    const formulario = e.target;
    switchAble();
    limpiarError();

    const name = formulario.bebidas_name.value.trim();
    const nameStartsWith = formulario.bebidas_nameStartsWith.value.trim();
    const limit = Math.min(100, Math.max(1, parseInt(formulario.bebidas_limit.value.trim())));
    const offset = Math.max(0, parseInt(formulario.bebidas_offset.value.trim()));

    // Logger de debug. Espera campos Nº1, 2, 3 y 4. Se confirman si se recibieron vacíos. La API no acepta los valores vacíos.
    /* counter = 0;
    errorCounter = 0;
    [isNameValid, isNameStartsWithValid, isLimitValid, isOffsetValid].forEach(rule => {
        counter++;
        if (!rule) {
            errorCounter++;
            console.log('Campo Nº' + counter + ' recibido vacío.');
        }
    });
    console.log(errorCounter + ' campos vacíos recibidos.'); */

    let args = [];
    if (name.length > 0) {
        args.push(('name=' + name).toString());
        console.log('Buscando por el nombre: ' + name);
    }

    if (nameStartsWith.length > 0) {
        args.push(('nameStartsWith=' + nameStartsWith).toString());
        console.log('Buscando por el nombre que comienza con: ' + nameStartsWith);
    }

    if (limit > 0 && limit != 20 && limit <= 100 && limit != NaN && typeof(limit) === 'number') {
        args.push(('limit=' + limit).toString());
        console.log('Limitando a ' + limit + ' resultados.');
    }

    if (offset > 0 && offset != NaN && typeof(offset) === 'number') {
        args.push(('offset=' + offset).toString());
        console.log('Desplazando ' + offset + ' resultados.');
    }

    const data = await buscarAPI('characters', false, ...args);
    if (data === -1) {
        generarError('Error al obtener las bebidas populares.', formulario);
        formulario.reset();
        switchAble(false);
        return;
    }

    generarBebidasPopulares(data);
}

/**
 * Buscan los Ingredientes populares en la API de ElCocktailDB según los campos del formulario.
 * @param {Event} e - Evento submit del formulario.
 * @async
 */
async function buscarIngredientesPopulares(e) {
    const formulario = e.target;
    switchAble();
    limpiarError();

    const title = formulario.ingredientes_title.value.trim();
    const titleStartsWith = formulario.ingredientes_titleStartsWith.value.trim();
    const format = formulario.ingredientes_format.value.trim();
    const formatType = formulario.ingredientes_formatType.value.trim();
    const startYear = parseInt(formulario.ingredientes_startYear.value.trim());
    const issueNumber = parseInt(formulario.ingredientes_issueNumber.value.trim());
    const noVariants = formulario.ingredientes_noVariants.checked;
    const hasDigitalIssue = formulario.ingredientes_hasDigitalIssue.checked;
    const limit = Math.min(100, Math.max(1, parseInt(formulario.ingredientes_limit.value.trim())));
    const offset = Math.max(0, parseInt(formulario.ingredientes_offset.value.trim()));

    const AÑO_ACTUAL = new Date().getFullYear();

    let args = [];
    if (title.length > 0) {
        args.push(('title=' + title).toString());
        console.log('Buscando por el nombre: ' + title);
    }

    if (titleStartsWith.length > 0) {
        args.push(('titleStartsWith=' + titleStartsWith).toString());
        console.log('Buscando por el nombre que comienza con: ' + titleStartsWith);
    }

    if (format.length > 0) {
        args.push(('format=' + format).toString());
        console.log('Buscando por el formato: ' + format);
    }

    if (formatType.length > 0) {
        args.push(('formatType=' + formatType).toString());
        console.log('Buscando por el tipo de formato: ' + formatType);
    }

    if (startYear > 0 && startYear <= AÑO_ACTUAL && startYear != NaN && typeof(startYear) === 'number') {
        args.push(('startYear=' + startYear).toString());
        console.log('Buscando por el año de inicio: ' + startYear);
    }

    if (issueNumber > 0 && issueNumber != NaN && typeof(issueNumber) === 'number') {
        args.push(('issueNumber=' + issueNumber).toString());
        console.log('Buscando por el número de issue: ' + issueNumber);
    }

    if (noVariants) {
        args.push('noVariants=true');
        console.log('Buscando ingredientes populares sin variantes.');
    }

    if (hasDigitalIssue) {
        args.push('hasDigitalIssue=true');
        console.log('Buscando ingredientes populares con versión digital.');
    }

    if (limit > 0 && limit != 20 && limit <= 100 && limit != NaN && typeof(limit) === 'number') {
        args.push(('limit=' + limit).toString());
        console.log('Limitando a ' + limit + ' resultados.');
    }

    if (offset > 0 && offset != NaN && typeof(offset) === 'number') {
        args.push(('offset=' + offset).toString());
        console.log('Desplazando ' + offset + ' resultados.');
    }

    const data = await buscarAPI('ingredientes', false, ...args);
    if (data === -1) {
        generarError('Error al obtener los ingredientes populares.', formulario);
        formulario.reset();
        switchAble(false);
        return;
    }

    generarIngredientesPopulares(data);
}

/**
 * Limpia el párrafo de error generado por generarError().
 */
function limpiarError() {
    let p = document.getElementById('error');
    if (p) {
        p.remove();
    }
}

/**
 * Genera un párrafo de error en el contenedor padre.
 * @param {String} msg - Mensaje de error.
 * @param {HTMLElement} parent - Contenedor padre.
 * @returns {void} Log de error a la consola.
 */
function generarError(msg, parent) {
    p = document.createElement('p');
    p.id = 'error';
    p.textContent = msg;
    parent.appendChild(p);
    console.log(msg);
    switchAble(false);
}

/**
 * Una función que se llama al cambiar el select de categorías.
 * Se intercambia el formulario que se muestra dependiendo de la categoría seleccionada. Requiere la clase 'TrueHidden'.
 * Recibe el evento automáticamente, no enviar ningún argumento.
 */
function switchCategory(e) {
    const formulario = document.getElementById('buscador');
    const category = e.target.value;
    const listado = document.getElementById('listado');
    const title = document.getElementById('category-title');
    let value;

    switch (category) {
        case "bebidas populares":
            value = "bebidas populares";
            break;

        case "ingredientes populares":
            value = "ingredientes populares";
            break;

        case "últimas bebidas":
            value = "últimas bebidas";
            break;

        case "ingredientes al azar":
            value = "ingredientes al azar";
            break;

        case "bebidas al azar":
            value = "bebidas al azar";
            break;

        default:
            value = "";
            break;
    }
    if (value !== "") {
        title.textContent = "Listado de " + value;
    } else {
        title.textContent = "Página de listados";
    }

    const fieldsets = formulario.querySelectorAll('fieldset');
    fieldsets.forEach(fieldset => {
        if (fieldset.id === 'buscador-' + category) {
            fieldset.classList.remove('TrueHidden');
        } else {
            fieldset.classList.add('TrueHidden');
        }
    });
    formulario.reset();
    listado.innerHTML = '';
    cargarEntrada(category);
    switchAble(true);
}

/**
 * Coloca el attributionText de un llamado a API en el link de copyright del footer.
 * 
 * @param {String} data - resultado inmediato del retorno de llamado a la API.
 */
function Copyright(data) {
    const footerCopy = document.getElementById('copyright');
    footerCopy.textContent = data.attributionText;
}

/**
 * Mueve el pie de página [fondo o libre] según sea necesario.
 * 
 * IF results, se quita la clase 'NoResults', lo que hace que el footer se ubique libremente para que los resultados lo desplace.
 * 
 * IF NOT results, se le pone la clase, lo que hace que se fuerce a mostrar en el fondo de la pantalla.
 * @param {Boolean} results - si hay resultados o no en vista (true).
 */
function moveFooter(results = true) {
    const footer = document.getElementById('footer');
    results ? footer.classList.remove('NoResults') : footer.classList.add('NoResults');
}   // FIXME

// FIXME: @moveFooter: No es atractivo ni ágil, hay que mejorarlo y hacer que no se necesite andar cambiando clases.











}