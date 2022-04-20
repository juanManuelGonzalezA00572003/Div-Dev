const path = require("path");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

exports.signup_get = (request, response, next) => {
  response.render("signup");
};

exports.datos = (request, response, next) => {
  console.log(request.session.usuario)
  Usuario.findProfile(request.session.usuario.login_usuario)
  .then(([rowsUsuarios, fieldData]) => {
    console.log(rowsUsuarios);
    response.status(200).json({
      datos: rowsUsuarios,
    });
  })
  .catch((err) => console.log(err));
};

exports.lista = (request, response, next) => {
  Usuario.fetchEstado()
    .then(([rowsRols, fieldDataRows]) => {
      Usuario.fetchAll()
        .then(([rowsUsuarios, fieldData]) => {
          console.log(rowsUsuarios);
          response.render("lista_usuarios", {
            usuarios: rowsUsuarios,
            rols: rowsRols,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};


exports.signup_post = (request, response, next) => {
  const usuario_nuevo = new Usuario(
    request.body.nombre,
    request.body.correo,
    request.body.contrasenia,
    "https://tanzolymp.com/images/default-non-user-no-photo-1.jpg"
  );

  usuario_nuevo
    .usuario_save()
    .then(() => {
      response.redirect("/usuario/login");
    })
    .catch((err) => console.log(err));
};

exports.login_get = (request, response, next) => {
  response.render("login", {
    //login_usuario??
    correo: request.session.correo ? request.session.correo : "",
    info: "",
  });
};

exports.login_post = (request, response, next) => {
  Usuario.findOne(request.body.correo)
    .then(([rows, fielData]) => {
      if (rows.length < 1) 
      {
        return response.redirect("usuario/login");
      }
      const usuario = new Usuario(
        rows[0].Nombre_Usuario,
        rows[0].Login,
        rows[0]["Contraseña"],
        rows[0].URL_Foto
      );
      bcrypt.compare(request.body.contrasenia, usuario.contrasenia_usuario)
        .then((doMatch) => {
          if (doMatch) {
            request.session.isLoggedIn = true;
            request.session.usuario = usuario;
            request.session.correo = usuario.login_usuario;
            //console.log(request.session.usuario);
            return request.session.save((err) => {
              response.redirect("/");
            });
          }
          response.redirect("/usuario/login");
        })
        .catch((err) => {
          console.log(err);
          response.redirect("/usuario/login");
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.logout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect("/usuario/login");
  });
};

// MODIFICAR USUARIO CU - EN PROCESO



exports.getDatosUsuario = (request, response, next) => {
  const id = request.params.id_usuario;

  Usuario.fetchOne(request.params.id_usuario)
    .then(([rowsUsuario, fielData]) => {
      Usuario.countActiveTickets(request.params.id_usuario)
      .then(([rowsTickets, fielData]) => {
        Usuario.fetchRolUsuario(request.params.id_usuario)
        .then(([rowsRol, fielData]) => {
          response.status(200).json({
            datosGenerales: rowsUsuario,
            rol : rowsRol,
            total : rowsTickets
          });
        })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
    })
    .catch((err) => {
      console.log(err);
  });
};

exports.usuario_post = (request, response, next) => {
  Usuario.update(
    request.params.id_usuario,
    request.body.rol,
  )
    .then(() => {
      response.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.profile_update = (request, response, next) => {
  console.log(request.body.name,
    request.body.id_usuario)
  Usuario.profile_update(
     request.body.name,
     request.body.id_usuario
  )
    .then(() => {
      response.status(200).json({hola:"jaks"});
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.profile_image = (request, response, next) => {
  image = request.file.filename;
  console.log("ESTE ES EL URL")
  console.log(request.file.filename)
//   Usuario.profile_update(
//      request.body.image_url,
//      request.body.id_usuario
//   )
//     .then(() => {
//       response.status(200).json({hola:"jaks"});
//     })
//     .catch((err) => {
//       console.log(err);
//     });
};

exports.panel_admin = (request, response, next) => {
  response.render('panel_administrativo');
};

