/**
 * Reserva.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Estudiantil',
  autoPK: false,
  migrate: 'safe',
  tableName: 'reserva_inscripcion',
  identity: 'Reserva',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
    },
    DependId: { model: 'Dependencias' },
    PlanId: { model: 'Planes' },
    TurnoId: 'string',
    CicloId: { model: 'Ciclos' },
    GradoId: { model: 'Grados' },
    OrientacionId: { model: 'Orientaciones' },
    OpcionId: { model: 'Opciones' },
    FechaInicioCurso: 'date',
    Vencimiento: 'datetime',
    PerId: { type: 'integer', index: true },
    Adulto: 'json',
  },

  reservar: function(perId,planId,cicloId,gradoId,orientacionId,opcionId,inicioCurso,callback) {
    var vencimiento = new Date();
    vencimiento.setHours(vencimiento.getHours()+1);

    // reservo el cupo o actualizo la reserva existente
    var findObj = {	PerId:perId,
                    PlanId:planId,
                    CicloId:cicloId,
                    GradoId:gradoId,
                    OrientacionId:orientacionId,
                    OpcionId:opcionId,
                    FechaInicioCurso:inicioCurso,
    };
    var createObj = {	PerId:perId,
                      PlanId:planId,
                      CicloId:cicloId,
                      GradoId:gradoId,
                      OrientacionId:orientacionId,
                      OpcionId:opcionId,
                      FechaInicioCurso:inicioCurso,
                      Vencimiento:vencimiento,
    };
    Reserva.findOrCreate(findObj,createObj,function(err,reserva){
      if (err) {
        return callback(err,undefined);
      }
      if (reserva.Vencimiento >= vencimiento) {
        // tengo una reserva válida
        return callback(undefined,reserva);
      }

      Reserva.update({id:reserva.id},{Vencimiento:vencimiento},function(err){
        if (err) {
          return callback(err,undefined);
        }
        return callback(undefined,reserva);
      });
    });
  },

  quedoInscripto: function(dependId,planId,cicloId,gradoId,orientacionId,opcionId,fechaInicioCurso,perId,callback) {
    return this.query(`
      UPDATE reserva_inscripcion
      SET Vencimiento=NOW()
      WHERE DependId = ?
        AND PlanId = ?
        AND CicloId = ?
        AND GradoId = ?
        AND OrientacionId = ?
        AND OpcionId = ?
        AND FechaInicioCurso = ?
        AND PerId = ?
      `,
        [dependId,planId,cicloId,gradoId,orientacionId,opcionId,fechaInicioCurso.fecha_ymd_toString(),perId],
        function(err,result){
          if (err) {
            return callback(err, undefined);
          }

          if (result.affectedRows < 1) {
            return callback(new Error("No se encuentra la reserva pedida"), undefined);
          }
          return callback(undefined, true);
        });
      },

};

Date.prototype.fecha_ymd_toString = function() {
        var sprintf = require("sprintf");
        return sprintf("%04d-%02d-%02d", this.getFullYear(),this.getMonth()+1,this.getDate());
};
