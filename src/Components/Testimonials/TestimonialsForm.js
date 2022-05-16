import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from "react-router-dom";
import '../FormStyles.css';
import {Get, PrivatePost, Put, Delete} from "../../Services/privateApiService"
import { Snackbar , Alert } from '@mui/material';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TestimonialForm = () => {
  const { id } = useParams();  
  const location = useLocation().pathname.toLocaleLowerCase();
  const history = useHistory();
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
})

  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    img:  ''
})


    //Mensajes de Error:
    const snackErrorCargaDatos = () =>{
        setSnack({...snack, 
        message:"Error en la carga de datos, intente nuevamente mas tarde.",
        open:true,
        severity:"error"
        })
    }

    const snackErrorName = () =>{
        setSnack({...snack, 
            message:"El nombre debe contener al menos 4 letras",
            open:true,
            severity:"error"
        }) 
    }
    
    const snackErrorEmpty = () =>{
        setSnack({...snack, 
            message:"No puede dejar campos vacíos",
            open:true,
            severity:"error"
        }) 
    }
    const snackErrorImage = () =>{
        setSnack({...snack, 
            message:"El formato de la imagen debe ser .jpg o .png",
            open:true,
            severity:"error"
        }) 
    }

//Obtener datos de usuarios y cargarlos en caso de encontrarlos con el id
  const getTestimonials = async () => {

    await Get(`${process.env.REACT_APP_URL_BASE_ENDPOINT}/testimonials`, id)
    .then(res => {
        const data=res.data.data;
        setInitialValues({
            ...initialValues,
            name:data.name || "",
            description: data.description || "",
            img:data.image || ""
        })
    })
    .catch(() => {
         snackErrorCargaDatos()
    })
    
  };

    useEffect(() => {
        getTestimonials()
    }, []);   


// Objeto creado a partir de los valores ingresados del form para enviar peticiones
const testimonialCreated={
    name: initialValues.name,
    description: initialValues.description,
    image: initialValues.img
} 
  

//Validaciones del form
const formValidation = () =>{
    const imgRegex = new RegExp(/(.jpg|.jpeg|.png)/i) 
    let formCorrecto = false;
    if(initialValues.name.length < 4){
        snackErrorName()
    }else if(initialValues.description === ""){
        snackErrorEmpty()
    }else if(!imgRegex.test(initialValues.img)){
        snackErrorImage()

    }
    else{
        formCorrecto = true;
    }
    return formCorrecto
}


//Envio del form y peticiones

const handleSubmit = async (e) => {
    e.preventDefault();
    if(formValidation()){
        if(location.includes("create")){
            PrivatePost(`${process.env.REACT_APP_URL_BASE_ENDPOINT}/testimonials`, testimonialCreated)
            history.push("/backoffice/testimonials") 
          }
        else if(location.includes("edit")){
            await Put(id, "/testimonials", testimonialCreated)
            history.push("/backoffice/testimonials") 
        }else if(location.includes("delete")){
            await Delete("/testimonials", id);
        }   
    }
}

    //Actualiza los datos con los que obtiene de los inputs del form
    const handleChange = (e) => {
        if(e.target.name === 'name')setInitialValues({...initialValues, name: e.target.value})
    }

    //Formateo de imagen a code64 para enviar a api
    function encodeImageAsURL(element) {
        var file = element.currentTarget.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
        setInitialValues({...initialValues, img: reader.result})}
        reader.readAsDataURL(file);
    }

    //Cierre de Notificación Snack
    const onCloseSnack = () =>{
        setSnack({...snack, open:false})
    }
    
    return (
        <>
        <h1 className="title-back" >{!id ? "Crear Testimonio" : (location.includes("edit") ? "Editar Testimonio" : "Eliminar Testimonio") }</h1>
        <form className="form-container form-back"  onSubmit={handleSubmit}>
            <h3 className="title-field-users">Nombre</h3>
            <input className="input-field input-back" type="text" name="name" value={initialValues.name} onChange={handleChange} placeholder="Name"></input>
            <h3 className="title-field-users">Descripción</h3>

            <CKEditor
                editor={ ClassicEditor }
                value={initialValues.description}
                onChange={(e, editor) => {
                    setInitialValues({...initialValues, description : (editor.getData()).replace(/<\/?[^>]+(>|$)/g, "")});
            }}
         
            /> 
            <h3 className="title-field-users">Seleccione una imagen</h3>
            <input className="input-field input-back-file" accept=".png, .jpg, .jpeg" type="file" name="img" onChange={encodeImageAsURL} placeholder="imagen"></input>
            <button className="form-back-submit-btn" type="submit">{!id ? "Crear" : (location.includes("edit") ? "Editar" : "Eliminar")}</button>
        </form>

        <Snackbar
                open={snack.open}
                severity={snack.severity}
                autoHideDuration={3000}
                onClose={onCloseSnack}>
                <Alert onClose={onCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </>
    );
}
 
export default TestimonialForm;