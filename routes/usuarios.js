const {Router} = require('express');
const { check } = require('express-validator');
const Role = require('../models/role');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controller/usuarios');
const { validarCampos } = require('../middlewares/validar-campos'); // Importa el middleware
const router = Router();

router.get('/', usuariosGet )

router.put('/:id', usuariosPut );

router.post('/',[
    check('nombre','El Nombre es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('password','El Password obligatorio y mas de 6 letras').isLength({min: 6}),
   // check('rol','No es un Rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(async(rol = '') => {
        const existeRol = await Role.findOne({rol});
        if(!existeRol) {
            throw new Error(`El rol ${rol} no esta registrado en la DB`)
        }
    }),
    validarCampos
],usuariosPost );

router.delete('/',usuariosDelete  );

router.patch('/', usuariosPatch );

module.exports = router;
