/**
 * Entrevista.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Estudiantil',
//  autoCreatedAt: false,
//  autoUpdatedAt: false,
//  autoPK: false,
//  migrate: 'safe',
  tableName: 'entrevista_inscripcion',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
    },
    DependId: { model: 'Dependencias' },
    FechaHora: 'datetime',
    Reserva: { model: 'Reserva' },
    Activa: 'boolean',
  },
  horasDisponibles: function(dependId,fecha,callback) {
   return this.query(`
     SELECT TIME(FechaHora) Hora
      FROM entrevista_inscripcion
     WHERE Dependid=?
       AND DATE(FechaHora) = ?
       AND Reserva is null
       AND Activa = 1
     GROUP BY TIME(FechaHora)
     `,
     [dependId,fecha.fecha_ymd_toString()],
     function(err,result){
       if (err) {
         return callback(err, undefined);
       }
       return callback(undefined, (result===null ? undefined : result));
     }
   );
  },
  diasDisponibles: function(dependId,mes,callback) {
    return this.query(`
      SELECT DAY(FechaHora) Dia
      FROM entrevista_inscripcion
      WHERE Dependid=?
        AND MONTH(FechaHora) = ?
        AND Reserva is null
        AND Activa = 1
      GROUP BY DAY(FechaHora)
      `,
      [dependId,mes],
      function(err,result){
        if (err) {
          return callback(err, undefined);
        }
        return callback(undefined, (result===null ? undefined : result));
      }
    );
  },
};

Date.prototype.fecha_ymd_toString = function() {
        var sprintf = require("sprintf");
        return sprintf("%04d-%02d-%02d", this.getFullYear(),this.getMonth()+1,this.getDate());
};
