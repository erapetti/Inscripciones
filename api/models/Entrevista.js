/**
 * Entrevista.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Estudiantil',
  autoPK: false,
  migrate: 'safe',
  tableName: 'entrevista_inscripcion',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
    },
    DependId: { model: 'Dependencias' },
    FechaHora: { type: 'datetime', index: true },
    Reserva: { model: 'Reserva', index: true },
    Activa: 'boolean',
  },
  horasDisponibles: function(dependId,fecha,callback) {
   return this.query(`
     SELECT TIME_FORMAT(FechaHora,'%H:%i') Hora
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
  asociarReserva: function(dependId,fechaHora,reservaId,callback) {
    return this.query(`
      UPDATE entrevista_inscripcion
      SET Reserva=if(DependId<>? or FechaHora<>? or Activa<>1,null,?)
      WHERE Reserva=?
         OR (DependId=?
             AND FechaHora=?
             AND Reserva is null
             AND Activa=1
            )
      `,
      [dependId,fechaHora.fecha_ymdhms_toString(),reservaId,reservaId,dependId,fechaHora.fecha_ymdhms_toString()],
      function(err,result){
        if (err) {
          return callback(err, undefined);
        }
        return callback(undefined, (result===null ? undefined : result));
      }
    );
  },
  liberarReserva: function(entrevistaId,reservaId,callback) {
    return this.query(`
      UPDATE entrevista_inscripcion
      SET Reserva=null
      WHERE id=?
        AND Reserva=?
        AND Activa=1
      LIMIT 1;
      `,
      [entrevistaId,reservaId],
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
Date.prototype.fecha_ymdhms_toString = function() {
        var sprintf = require("sprintf");
        return sprintf("%04d-%02d-%02d %02d:%02d:%02d", this.getFullYear(),this.getMonth()+1,this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds());
};
