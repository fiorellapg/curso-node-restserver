// usuarios.js controller
const {response, request}= require('express');
const bcryptjs = require('bcryptjs');
const Usuario= require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = async(req = request, res = response) => {
    // const {q,nombre = 'no envia',apikey} = req.query;
    const {limite=5, desde = 0} = req.query; // indicamos que vamos ha recibir un parametro: limite,con volor por defecto 5
    const query = {estado:true};
    const [total,usuarios] = await Promise.all([
         Usuario.countDocuments(query), //retorna total
         Usuario.find(query) //retorna los usuarios
         .skip(Number(desde))
         .limit(Number(limite))
    ]);
    res.json({
         total,
         usuarios
     });
    //encuentra desde al limite registros de la DB
    /* const usuarios = await Usuario.find(query)
         .skip(Number(desde))
         .limit(Number(limite)); 
     const total = await Usuario.countDocuments(query); */
    
 }
 
const usuariosPut = async(req, res= response) => {
    const {id } = req.params; // params puede traer muchos datos.
    //excluyo password, google y correo (no se actualizan) y todo lo demas lo almaceno es resto
    const {_id, password,google,correo, ...resto} = req.body;
    //POR HACER validar id contra la DB 
    if (password){
        //encritar la contrasena en caso que venga en el body
        const salt = bcryptjs.genSaltSync();//cantidad de vueltas que hara la encriptacion por def.10
        resto.password = bcryptjs.hashSync(password); //encripta el password
    }
    //actualiza el registro: lo busca por id y actualiza con los valores de resto
    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json({
        msg: 'put API - controller',
        usuario
    });
}

const usuariosPost = async(req, res = response) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json(errores);
    }

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre,correo, password, rol});
    
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password);
    
    await usuario.save();
    res.json({
        msg: 'post API - controller',
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;
    //borrado fisico.
    const usuario = await Usuario.findByIdAndDelete(id);
    res.json({
       usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
