const path = require("path");
const Privilegio = require("../models/privilegio");
const Rol = require("../models/rol");
const Usuario = require("../models/usuario");

exports.getRoles = (request, response, next) => {
    if (request.session.privilegios.includes(12)) {
        Privilegio.fetchPrivilegios()
                    .then(([rowsPrivs, fieldDataPrivs]) => {
                        Privilegio.fetchAll()
                            .then(([rowsall, fieldData]) => {
                                Rol.fetchAll()
                                    .then(([rows, fieldData]) => {
                                        response.render('administrar_privilegios',{allprivilegios: rowsall, privilegiosact: rowsPrivs, roles: rows});
                                    })
                                    .catch(err => console.log(err));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
    }
    else {
        response.redirect("/");
    }
}

exports.EliminaPrivilegio = (request, response, next) => {
    if (request.session.privilegios.includes(12)) {
    const id_rol = request.body.Rol;
    const id_priv = request.body.Id_Privilegio;
        Privilegio.EliminaPrivilegio(id_rol, id_priv)
            .then(response.status(200).json({}))
            .catch(err => console.log(err));
    }
}

exports.AgregaPrivilegio = (request, response, next) => {
    const id_rol = request.body.Rol;
    const id_priv = request.body.Id_Privilegio;
            Privilegio.AgregaPrivilegio(id_rol, id_priv)
            .then(response.status(200).json({}))
            .catch(err => console.log(err));
}

exports.CreaRol = (request, response, next) => {
    Rol.CreaRol(request.body.Nombre_Rol)
    .then(response.status(200).json({}))
    .catch(err => console.log(err));
}

exports.ModificaRol = (request, response, next) => {
    Rol.getId(request.body.Rol)
        .then(([rowsid, fieldData]) => {
            Rol.update((rowsid[0].Id_Rol), request.body.Nuevo)
                .then(response.status(200).json({}))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

exports.EliminaRol = async (request, response, next) => {
    Rol.getId(request.body.Rol)
        .then(([rowsid, fieldData]) => {
            if(((rowsid[0].Id_Rol) == 1) || ((rowsid[0].Id_Rol) == 4)){
                response.status(200).json({cont: 0})
            }else{
                Privilegio.deleteprivs((rowsid[0].Id_Rol))
                .then(
                    Usuario.changerol((rowsid[0].Id_Rol))
                    .then(
                        Rol.delete((rowsid[0].Id_Rol))
                        .then(response.status(200).json({cont: 1}))
                        .catch(err => console.log(err))
                ))
            }
        })
        .catch(err => console.log(err));
}