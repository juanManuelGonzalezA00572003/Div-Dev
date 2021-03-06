
function openTicket(element) {
    document.getElementById("commentShow").style.display = "none";
    const id_ticket = element.id.match(/\d+/g);

    document.getElementById("Id_Ticket").value = id_ticket;

    let preguntas = document.getElementById("preguntas");
    let preguntas_nuevas = document.getElementById("preguntas_nuevas");
    let asunto = document.getElementById("asunto");
    let id_ticket_div = document.getElementById("id_ticket");
    let select_estado = document.getElementById("select_estado");
    let estado_actual = document.getElementById("Estado_Actual");
    let select_tipo_incidencia = document.getElementById("select_tipo_incidencia");
    let select_prioridad = document.getElementById("select_prioridad");
    let boton_comentarios = document.getElementById("boton_comentarios");
    let descripcion = document.getElementById("descripcion");
    let labels= document.getElementById("label_display");

    let rutaDatos = '../tickets/datos/' + id_ticket;

    fetch(rutaDatos, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response.privilegios);
        
        asunto.innerHTML = response.datosGenerales[0].Asunto;
        id_ticket_div.innerHTML = id_ticket;

        select_estado.namedItem("estado"+response.estado[0].Id_Estado).selected = true;
        estado_actual.value = response.estado[0].Id_Estado;
        select_tipo_incidencia.namedItem("tipo_incidencia"+response.datosGenerales[0].Id_Tipo_Incidencia).selected = true;

        select_prioridad.namedItem("prioridad"+response.datosGenerales[0].Id_Prioridad).selected = true;

        descripcion.innerHTML = response.datosGenerales[0].Descripcion;
        let fecha_fin = "";
        document.getElementById("fecha_fin").innerHTML = '';
        if (response.datosGenerales[0].Fecha_Fin != null){
            fecha_fin = new Date(response.datosGenerales[0].Fecha_Fin);
            document.getElementById("fecha_fin").innerHTML = 'Fecha que se termino: ' + (fecha_fin.toString()).substring(4,21);
        }
        preguntas.innerHTML = '';
        labels.innerHTML = 'Labels:';
        preguntas_nuevas.innerHTML = '';
        for(let pregunta of response.preguntas)
        {
            preguntas.innerHTML += '<div class="row"><div class="col"><label class="col-form-label"><b>' + pregunta.Pregunta + '</b></label></div></div><div class="row"><div class="col">' + pregunta.Respuesta + '</div></div>';
        }
        for(let label of response.labels)
        {
            labels.innerHTML +=  '<span class="badge bg-secondary m-2">' + label.Id_Label  + '</span>';
        } 
        if (!response.privilegios.includes(3)){
            document.getElementById("select_estado").style.display="none";
            document.getElementById("Usuario_Estado").innerHTML=response.estado[0].Nombre_Estado;
            document.getElementById("select_prioridad").style.display="none";
            document.getElementById("Usuario_Prioridad").innerHTML=response.datosGenerales[0].Nombre_Prioridad;
            document.getElementById("select_tipo_incidencia").style.display="none";
            document.getElementById("Usuario_Tipo").innerHTML=response.datosGenerales[0].Nombre_Tipo_Incidencia;
            document.getElementById("enviar").style.display="none";
            document.getElementById("archivar").style.display="none";
            

        }else{
        }
        
    }).catch(err => {
        console.log(err);
    });

  cargaUsuarios();
  document.getElementById("Ticket").style.display = "flex";
}


document.getElementById("select_tipo_incidencia").onchange = () =>
{
    let preguntas = document.getElementById("preguntas_nuevas");
    let idTipo = document.getElementById("select_tipo_incidencia").value;
    const csrf = document.getElementById('_csrf').value;
    let idTicket = document.getElementById('Id_Ticket').value;

    let data={
        id:idTicket
    }
    let rutaPreguntas = '../tipo_incidencia/preguntasNuevas/' + idTipo;
    
    preguntas.innerHTML = '';
    fetch(rutaPreguntas, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        let cont = 0;
        for(let pregunta of response.preguntas)
        {
            preguntas.innerHTML += '<div> <label for="respuesta' + cont + '"><b>' + pregunta.Texto_Pregunta + '</b> </label> </div> <div> <input type="text" id="respuesta' + cont + '" name="respuesta' + cont + '"> </div> <br><br> ';
            preguntas.innerHTML += '<input type="hidden" id="pregunta' + cont + '" name="pregunta' + cont + '" value="' + pregunta.Id_Pregunta + '">';
            cont++;
        }
        document.getElementById("numPreguntas").value = cont;
        
    }).catch(err => {
        console.log(err);
    });
    
}
// Comentarios
document.getElementById("boton_comentarios").onclick = () =>
{ 
  
  const id_ticket = document.getElementById("Id_Ticket").value;

  //document.getElementById("Id_Ticket").value = id_ticket;

    let comentarios = document.getElementById("comentarios");
    let rutaPreguntas = '../comentario/datos/' + id_ticket;

    fetch(rutaPreguntas, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        comentarios.innerHTML = '';
        //comentarios_nuevas.innerHTML = '';
                                              

        for(let comentario of response.comentarios)
        {   
            let fecha_comment = new Date(comentario.Fecha_y_Hora);
            if(comentario.URL_Archivo != ''){
                if (comentario.URL_Archivo.includes(".jpg") || comentario.URL_Archivo.includes(".jpeg") || comentario.URL_Archivo.includes(".png") || comentario.URL_Archivo.includes(".gif")){
                    comentarios.innerHTML += '<div class="card mb-4"> <div class="card-body"> <p>' + comentario.Texto_Comentario + '</p> <a href="/uploads/'+comentario.URL_Archivo+'" download ='+comentario.URL_Archivo+'> <img src="/uploads/'+comentario.URL_Archivo+'" alt="Download foto adjunta"> </a> <div class="d-flex justify-content-between"> <div class="d-flex flex-row align-items-center"> <img src="'+ comentario.URL_Archivo +  '" alt="avatar" width="25" height="25" /> <p class="small mb-0 ms-2">' + comentario.Nombre_Usuario + '</p> </div> <div class="d-flex flex-row align-items-center"> <p class="small text-muted mb-0"> Comentado en: <span style="overflow: hidden;margin-left: 10px;color: rgb(136,136,136);"' + 
                    ticket.Fecha_Inicio.toString().substring(4, 21) + '</span>' + comentario.Fecha_y_Hora + '</p> </div> </div> </div> </div>'
                }else{
                    comentarios.innerHTML += '<div class="card mb-4"> <div class="card-body"> <p>' + comentario.Texto_Comentario + '</p> <div class="d-flex justify-content-between"> <div class="d-flex flex-row align-items-center"> <img src="'+ comentario.URL_Foto + '" alt="avatar" width="25" height="25" /> <p class="small mb-0 ms-2">' + comentario.Nombre_Usuario + '</p> </div> <div class="d-flex flex-row align-items-center"> <p class="small text-muted mb-0"> Comentado en: '+ (fecha_comment.toString()).substring(4,21) +'</p> </div> </div> </div> </div>'
                }
            }else{
                comentarios.innerHTML += '<div class="card mb-4"> <div class="card-body"> <p>' + comentario.Texto_Comentario + '</p> <div class="d-flex justify-content-between"> <div class="d-flex flex-row align-items-center"> <img src="' + comentario.URL_Foto + '" alt="avatar" width="25" height="25" /> <p class="small mb-0 ms-2">' + comentario.Nombre_Usuario + '</p> </div> <div class="d-flex flex-row align-items-center"> <p class="small text-muted mb-0"> Comentado en: '+ (fecha_comment.toString()).substring(4,21) +'</p> </div> </div> </div> </div>'
            }
        }
    }).catch(err => {
        console.log(err);
    });

  document.getElementById("commentShow").style.display = "flex";

}

function submitForm(){
  const id_ticket = document.getElementById("Id_Ticket").value;

  //document.getElementById("Id_Ticket").value = id_ticket;
    const csrf = document.getElementById("_csrf").value;

    let comentarios = document.getElementById("comentarios");
    let comentarios_nuevos = document.getElementById("nuevoComentario");
    let rutaPreguntas = '../comentario/nuevo/' + id_ticket;
    let id_tickett = document.getElementById("id_ticket");
    id_tickett.value = id_ticket;
    let texto_comentario = document.getElementById("texto_comentario");


    data = {
        id_ticket:id_tickett.value,
        texto_comentario:texto_comentario.value
      }
      
      fetch(rutaPreguntas, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        toastCambiosGuardados()
        comentarios.innerHTML = "";
        for(let comentario of response.comentarios)
        {   
            let fecha_comment = new Date(comentario.Fecha_y_Hora);
            if(comentario.URL_Archivo != ''){
                if (comentario.URL_Archivo.includes(".jpg") || comentario.URL_Archivo.includes(".jpeg") || comentario.URL_Archivo.includes(".png") || comentario.URL_Archivo.includes(".gif")){
                    comentarios.innerHTML += '<div class="card mb-4"> <div class="card-body"> <p>' + comentario.Texto_Comentario + '</p> <a href="/uploads/'+comentario.URL_Archivo+'" download ='+comentario.URL_Archivo+'> <img src="/uploads/'+comentario.URL_Archivo+'" alt="Download foto adjunta"> </a> <div class="d-flex justify-content-between"> <div class="d-flex flex-row align-items-center"> <img src="' + comentario.URL_Foto +'" alt="avatar" width="25" height="25" /> <p class="small mb-0 ms-2">' + comentario.Nombre_Usuario + '</p> </div> <div class="d-flex flex-row align-items-center"> <p class="small text-muted mb-0"> Comentado en: <span style="overflow: hidden;margin-left: 10px;color: rgb(136,136,136);"' + 
                    ticket.Fecha_Inicio.toString().substring(4, 21) + '</span>' + comentario.Fecha_y_Hora + '</p> </div> </div> </div> </div>'
                }else{
                    comentarios.innerHTML += '<div class="card mb-4"> <div class="card-body"> <p>' + comentario.Texto_Comentario + '</p> <div class="d-flex justify-content-between"> <div class="d-flex flex-row align-items-center"> <img src="'+ comentario.URL_Foto + '" alt="avatar" width="25" height="25" /> <p class="small mb-0 ms-2">' + comentario.Nombre_Usuario + '</p> </div> <div class="d-flex flex-row align-items-center"> <p class="small text-muted mb-0"> Comentado en: '+ (fecha_comment.toString()).substring(4,21) +'</p> </div> </div> </div> </div>'
                }
            }else{
                comentarios.innerHTML += '<div class="card mb-4"> <div class="card-body"> <p>' + comentario.Texto_Comentario + '</p> <div class="d-flex justify-content-between"> <div class="d-flex flex-row align-items-center"> <img src="' + comentario.URL_Foto + '" alt="avatar" width="25" height="25" /> <p class="small mb-0 ms-2">' + comentario.Nombre_Usuario + '</p> </div> <div class="d-flex flex-row align-items-center"> <p class="small text-muted mb-0"> Comentado en: '+ (fecha_comment.toString()).substring(4,21) +'</p> </div> </div> </div> </div>'
            }
        }
        document.getElementById("commentShow").style.display = "flex";
    }).catch(err => {
        console.log(err);
    });

  

}


document.getElementById("enviar").onclick = () =>
{
    
    const idTicket = document.getElementById("Id_Ticket").value;
    let preguntas = document.getElementById("preguntas");
    let select_estado = document.getElementById("select_estado");
    let estado_actual = document.getElementById("Estado_Actual");
    let select_tipo_incidencia = document.getElementById("select_tipo_incidencia");
    let select_prioridad = document.getElementById("select_prioridad");
    let numPreguntas_ = document.getElementById("numPreguntas").value;
    const csrf = document.getElementById('_csrf').value;

    let preguntas_nuevas = [];
    for(let i = 0; i < numPreguntas_; i++)
    { 
      let actualP = 'pregunta' + i;
      let actualR = 'respuesta' + i;
      preguntas_nuevas.push({pregunta:document.getElementById(actualP).value, respuesta:document.getElementById(actualR).value})
    }
    document.getElementById("numPreguntas").value = 0;
    data = {
      estado:select_estado.value,
      prioridad:select_prioridad.value,
      Estado_Actual:estado_actual.value,
      tipo_incidencia:select_tipo_incidencia.value,
      preguntas:preguntas_nuevas,
      numPreguntas:numPreguntas_
    }
    ruta = '../tickets/' + idTicket
    fetch(ruta, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrf
      },
      body:JSON.stringify(data)
  })
  .then(response => {
      
      toastCambiosGuardados()
     
     
    
      
      
  }).catch(err => {
      console.log(err);
  });
}

document.getElementById("archivar").onclick = () =>
{
    const idTicket = document.getElementById("Id_Ticket").value;
    const csrf = document.getElementById('_csrf').value;
    let ruta = '../tickets/archivar/' + idTicket;
    const archivar = 1;
    var text = '';
    const bool_archivar = document.getElementById("Bool").value;
    if (bool_archivar==0){
        text = 'desarchivado'
    } else { text = 'archivado'}
    data = {
      Archivado : bool_archivar
    }

    fetch(ruta, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrf
      },
      body:JSON.stringify(data)
  })
  .then(response => {
    new Swal({
        title: '????xito!',
        text: 'Se ha ' + text + ' el ticket',
        icon: 'success',
        timer: 800,
        showConfirmButton: false
    })
      .then(response => {
        document.location.reload();
        
      })
      
  }).catch(err => {
      console.log(err);
  });
}

function cargaUsuarios()
{ 
    const id_ticket = document.getElementById("Id_Ticket").value;
    let select = document.getElementById("select_encargado");
    let ruta = '../tickets/' + id_ticket + '/asignar_usuario';

    fetch(ruta, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        select.innerHTML = '';
        let optAct = document.createElement('option');
        optAct.value = response.encargado[0].Id_Usuario;
        optAct.innerHTML = response.encargado[0].Nombre_Usuario;
        select.appendChild(optAct);

        for(usuario of response.usuarios)
        {
            if(usuario.Id_Usuario != response.encargado[0].Id_Usuario)
            {
                let opt = document.createElement('option');
                opt.value = usuario.Id_Usuario;
                opt.innerHTML = usuario.Nombre_Usuario;
                select.appendChild(opt);
            }
        }
        

    }).catch(err => {
        console.log(err);
    });

}

document.getElementById("asignar").onclick = () =>
{
    const idTicket = document.getElementById("Id_Ticket").value;
    const csrf = document.getElementById('_csrf').value;
    let ruta = '../tickets/' + idTicket + '/asignar_usuario';
    let encargado_f = document.getElementById("select_encargado").value

    data = {
      encargado: encargado_f
    }

    fetch(ruta, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrf
      },
      body:JSON.stringify(data)
  })
  .then(response => {
    toastCambiosGuardados()
     
  }).catch(err => {
      console.log(err);
  });
}


function closeTicket() {
  $('.modal').modal('hide');
  $('.modal-backdrop').hide();
  document.location.reload()
  document.getElementById("commentShow").style.display = "none";
}

$(document).ready(function(){

    $("#Ticket").on('hidden.bs.modal', function(){
      location.reload()
    });
  });

function toastCambiosGuardados() {

    var x = document.getElementById("snackbar");
    x.className = "show";  
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}