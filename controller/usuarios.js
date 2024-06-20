const {response, request}= require('express');
const bcryptjs = require('bcryptjs');
const Usuario= require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = (req = request, res = response) => {
    const {q,nombre = 'no envia',apikey} = req.query;
    res.json({
        msg: 'get API - controller',
        q,
        nombre,
        apikey
    });
}

const usuariosPut =(req, res= response) => {
    const {id } = req.params; // params puede traer muchos datos.
    res.json({
        msg: 'put API - controller',
        id
    });
}

const usuariosPost = async(req, res = response) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json(errores);
    }

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre,correo, password, rol});
    //veriificar si existe correo
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg: 'El correo ya esta registrado'
        });
    }
    //encritar la contrasena
    const salt = bcryptjs.genSaltSync();//cantidad de vueltas que hara la encriptacion por def.10
    usuario.password = bcryptjs.hashSync(password); //encripta el password
    await usuario.save(); // esto es para grabar en BD
    res.json({
        msg: 'post API - controller',
        usuario
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controller'
    });
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

//se exporta un objeto pues van haber muchos
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}