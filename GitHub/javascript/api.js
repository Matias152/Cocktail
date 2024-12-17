const key_public = "8f0a1c2b3d4e5f6g7h8i9j0k";
const key_private = "a3b4c6d8e9f1g2h5i7j0k9l"
const API = "https://www.thecocktaildb.com/";
var ts;
var hash;

/** Fetch completo deseado de la API del TheCocktailDB.
 * La función principal es index.js y representa la entrega de bienvenida.
 * 
 * Se realiza al cambiar entre las bebidas.
 * @param type String. El valor de tipo de fetch para hacer (tragos)
 * @param print Bool. Cuando quiere imprimir la URL en consola (false)
 * @returns {Response | -1} data IF accomplished, -1 IF error.
 * @async 
 */

async function index(type = 'tragos', print = false) {
    try {
        const response = await fetch(URLsearchCategory(type, print));
        const data = await response.json();
        if (response.ok && data.code === 200) {
            return data;
        }
        throw new Error('error: ' + (data.status, data.data.code, data.data.status));
    } catch (error) {
        console.log(error);
        return (-1);
    }
    
}

/**
 * Fetch de cocteles con los filtros especificados.
 * @param {String} type String. El valor de tipo de fetch a hacer (bebidas populares, ingredientes populares, últimas bebidas, ingredientes al azar, bebidas al azar).
 * @param {Bool} print Bool. Cuando se quiere imprimir la URL en consola.
 * @param {String} attributes Array. "attributeName=value"
 * @returns {Response | -1} data IF accomplished, -1 IF error.
 * @async
 */
async function buscarAPI(type, print, ...attributes) {
    if (!attributes) {
        try {
            const response = await index(type, print);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return (-1);
        }
    } else {
        try {
            const response = await fetch(URLsearchBy(type, print, ...attributes), {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok && data.code == 200) {
                return data;
            }
            console.log(data);
            console.log(data.data);
            return (-1);
        } catch (error) {
            console.log(error);
            return (-1);
        }
    }
}

/**
 * Retorna la URL para obtener el listado de tragos completo, o el value para especificarse.
 * La URL incluye el APIkey, timestamp y hash correspondientes.
 * Print es solamente para poder visitar la API rápidamente y ver el formato de la response.
 * 
 * Es usada para el índice de cada categoría.
 * @param value String. El valor de tipo de fetch a hacer (tragos).
 * @param print Bool. Cuando quiere imprimir la URL en consola (false).
 * @returns {String} String. URL text.
 */

function URLsearchCategory(value = 'tragos', print = false) {
    generateHash();
    url = (API + value + '?apikey=' + key_public + '&ts=' + ts + '&hash=' + hash).toString();
    if (print) {
        console.log(url)
    }
    return url;
}

/**
 * Se retorna la URL para obtener el listado deseado con los filtros especificados.
 * @param {String} type String. El valor de tipo de fetch a hacer (bebidas populares, ingredientes, últimas bebidas, ingredientes al azar, bebidas al azar).
 * @param {Bool} print Bool. Cuando quiere imprimir la URL en consola.
 * @param {String} args Array. "attributeName=value"
 * @returns {String} String. URL text.
 */
function URLsearchBy(type, print, ...args) {
    generateHash();
    let req = API + type;
    let hasFoundFirstElement = false;
    args.forEach(arg => {
        arg = arg.split('=');
        arg = arg[0] + '=' + encodeURIComponent(arg[1]);
        if (!hasFoundFirstElement) {
            req += '?';
            hasFoundFirstElement = true;
        } else {
            req += '&';
        }
        req += arg;
    });
    if (hasFoundFirstElement) {
        req += '&';
    } else {
        req += '?';
    }
    req += 'apikey=' + key_public + '&ts=' + ts + '&hash=' + hash;
    if (print) {
        console.log(req);
    }
    return req;
}

/**
 * Genera nuevos timestamp y hash válidos para la API.
 */
function generateHash() {
    ts = new Date().getTime().toString();
    hash = Mojito.MD5(ts + key_private + key_public).toString();
}


