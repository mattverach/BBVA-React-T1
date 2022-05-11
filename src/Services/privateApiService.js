import axios from 'axios';

const API_BASE_URL = 'https://ongapi.alkemy.org/api/'
const access_token = ""

const config = {
    headers: {
        Group: 1,                //Aqui va el ID del equipo!!
        Authorization: `token ${access_token}`,
        'Access-Control-Allow-Headers': ''
    }
}



export const Get =  async (endpoint, id = null) => {
    try{
    const param = (id) ? `/${id}`: "";
    return await axios.get(`${API_BASE_URL}${endpoint}${param}`, config)
    }
    catch(err){
        return err;
    }
}

/** Método DELETE a los endpoints privados
 *    REQUISITOS:
 *     - route := ruta destino
 *     - id := identificador de usuario
 *    DEVUELVE: 
 *     - Res de la promesa en caso de que se haya ejecutado correctamente.
 *     - Err producido por la petición incorrecta.
 *    
 */

export const Delete = async (route, id) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}${route}/${id}`, config.headers);
        return res;
    } catch (err) { return err; }
}


/**
 * Actualiza los datos de la ruta destino
 * @function
 * @param id Id del recurso a actualizar
 * @param route Ruta del recurso, se ingresa sin las barras, ej: route = "slides"
 * @param body Se pasa el objeto del recurso a actualizar
 * 
 * @returns Promesa de axios, se debe capturar los metodos then y catch en caso de error
 */
export const Put = (id, route, body) => {
    return axios.put(`${API_BASE_URL}${route}/${id}`,body,config)
}

