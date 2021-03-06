const db = require('../util/database');
const bcrypt = require('bcryptjs');


module.exports = class Label{ 

    constructor(id, visibilidad) {
        this.id_label = id;
        this.visibilidad_label = visibilidad;
    }

    save() {
    }

    update()
    {
        return db.execute('UPDATE label SET Visibilidad_Label =? WHERE Id_Label =?',
            [
                this.visibilidad_label,
                this.id_label
            ]
        );
    }

    static fetchAll(texto_ingresado) {
        return db.execute('SELECT * FROM label WHERE Visibilidad_Label = 1');
    }

    static fetchLike(texto_ingresado) {
        return db.execute('SELECT * FROM label WHERE Visibilidad_Label = 1 AND Id_Label LIKE ?', ['%' + texto_ingresado + '%']);
    }

}