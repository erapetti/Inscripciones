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
  tableName: 'entrevistas_inscripcion',
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
    FechaEntrevista: 'date',
    Vencimiento: 'datetime',
    PerId: 'integer',
  },

  reservar:function(perId,planId,cicloId,gradoId,orientacionId,opcionId,callback) {
    var vencimiento = new Date();
    vencimiento.setHour(vencimiento.Hour()+1);

    // reservo el cupo o actualizo la reserva existente
    var findObj = {	PerId:perId,
                    PlanId:planId,
                    CicloId:cicloId,
                    GradoId:gradoId,
                    OrientacionId:orientacionId,
                    OpcionId:opcionId,
    };
    var createObj = {	PerId:perId,
                      PlanId:planId,
                      CicloId:cicloId,
                      GradoId:gradoId,
                      OrientacionId:orientacionId,
                      OpcionId:opcionId,
                      Vencimiento:vencimiento,
    };
    Entrevista.findOrCreate(findObj,createObj,function(err,entrevista){
      if (err) {
        callback(err,undefined);
      }

      console.log("entrevistas",entrevista);
      console.log(entrevista.Vencimiento);
      if (entrevista.Vencimiento < vencimiento) {
        console.log("actualizo vencimiento");
      }
      callback(undefined,entrevista);
    });
  },
};
