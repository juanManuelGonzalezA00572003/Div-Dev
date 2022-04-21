const text = require('body-parser/lib/types/text');
const db = require('../util/database');

module.exports = class Pregunta{

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(texto_pregunta) {
        this.pregunta_texto_pregunta = texto_pregunta;
        this.pregunta_visibilidad = 1;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    pregunta_save() {
        return db.execute('SELECT * FROM pregunta WHERE Texto_Pregunta = ?', [this.pregunta_texto_pregunta])
            .then(([rows, fieldData]) =>{
                if(rows.length == 0)
                {
                    db.execute('INSERT INTO pregunta(Texto_Pregunta, Visibilidad_Pregunta) VALUES (?,?)',
                    [
                        this.pregunta_texto_pregunta,
                        this.pregunta_visibilidad
                    ])
                    .then()
                    .catch(err => console.log(err));
                }
            })
        .catch(err => console.log(err));
    }

    static async pregunta_check(texto_pregunta){
        return db.execute('SELECT EXISTS(SELECT * FROM pregunta p WHERE p.Texto_Pregunta = ?) AS E',
            [texto_pregunta]
        );
    }

    static async pregunta_getId(texto_pregunta){
        return db.execute('SELECT p.Id_Pregunta FROM pregunta p WHERE p.Texto_Pregunta = ?',
            [texto_pregunta]
        );
    }

    static pregunta_fetch_lastinsertion(){
        return db.execute('SELECT (SELECT MAX(Id_Pregunta) FROM pregunta p WHERE p.Visibilidad_Pregunta = 1) AS L');
    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM pregunta');
    }

    static fetchLike(texto_ingresado) {
        return db.execute('SELECT * FROM pregunta WHERE Visibilidad_Pregunta = 1 AND Texto_Pregunta LIKE ?', ['%' + texto_ingresado + '%']);
    }

    static agregaPregunta(id_pregunta,id_tipo_incidencia) {
        return db.execute('INSERT INTO tipo_incidencia_pregunta(Id_Pregunta, Id_Tipo_Incidencia) VALUES (?,?)',
            [
                id_pregunta,
                id_tipo_incidencia
            ]
        );
    }
    
    static cambiaVisibilidad(P, V){
        if(V == 1){
            return db.execute('UPDATE pregunta SET Visibilidad_Pregunta = 0 WHERE Texto_Pregunta = ?',
            [
                P
            ]);
        }else{
            return db.execute('UPDATE pregunta SET Visibilidad_Pregunta = 1 WHERE Texto_Pregunta = ?',
            [
                P
            ]);
        }
    }

}