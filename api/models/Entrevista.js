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
    Entrevista.find({DependId:dependid, FechaHora:fecha, Reserva:null, Activa:1})
              .groupBy('FechaHora')
              .exec(function(err,entrevistas){
      if (err) {
        callback(err, undefined);
      }
      return(undefined, entrevistas);
    });
  },
  diasDisponibles: function(dependId,mes,callback) {
    return this.query(`
      SELECT DAY(FechaHora)
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
      },
    );
  },
};
