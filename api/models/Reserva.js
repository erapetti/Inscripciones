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

  reservar:function(perId,planId,cicloId,gradoId,orientacionId,opcionId,inicioCurso,callback) {
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
        // ya hay una reserva válida
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
};
