/**
 * WsController
 *
 * @description :: Server-side logic for managing ws
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// http://localhost:1337/ws/tieneLugar?dependId=101&planId=27&turnoId=D&cicloId=1&gradoId=1&orientacionId=1&opcionId=1&fechaInicioCurso=2017-03-01

module.exports = {

  tieneLugar: function (req, res) {

    var dependId = parseInt(req.param('dependId'));
    var planId = parseInt(req.param('planId'));
    var turnoId = typeof req.param('turnoId') !== 'undefined' ? req.param('turnoId').substr(0,2) : undefined;
    var cicloId = parseInt(req.param('cicloId'));
    var gradoId = parseInt(req.param('gradoId'));
    var orientacionId = parseInt(req.param('orientacionId'));
    var opcionId = parseInt(req.param('opcionId'));
    var fechaInicioCurso = typeof req.param('fechaInicioCurso') !== 'undefined' ? new Date(req.param('fechaInicioCurso').substr(0,10)+"T05:00:00.000Z") : undefined;

    if (!dependId || !planId || !turnoId || !cicloId || !gradoId || !orientacionId || !opcionId || !fechaInicioCurso) {
      return res.json({error:101,errstr:"Parámetros incorrectos"});
    }

    Cupos.tieneLugar(dependId,planId,turnoId,cicloId,gradoId,orientacionId,opcionId,fechaInicioCurso,function(err,tieneLugar){
      if (err) {
        return res.json({error:103,errstr:err.message});
      }
      return res.json({error:0,tieneLugar:tieneLugar});
    });
  },

  quedoInscripto: function (req, res) {

    var dependId = parseInt(req.param('dependId'));
    var planId = parseInt(req.param('planId'));
    var turnoId = typeof req.param('turnoId') !== 'undefined' ? req.param('turnoId').substr(0,2) : undefined;
    var cicloId = parseInt(req.param('cicloId'));
    var gradoId = parseInt(req.param('gradoId'));
    var orientacionId = parseInt(req.param('orientacionId'));
    var opcionId = parseInt(req.param('opcionId'));
    var fechaInicioCurso = typeof req.param('fechaInicioCurso') !== 'undefined' ? new Date(req.param('fechaInicioCurso').substr(0,10)+"T05:00:00.000Z") : undefined;
    var perId = parseInt(req.param('perId'));

    if (!dependId || !planId || !turnoId || !cicloId || !gradoId || !orientacionId || !opcionId || !fechaInicioCurso || !perId) {
      return res.json({error:201,errstr:"Parámetros incorrectos"});
    }

    Reserva.quedoInscripto(dependId,planId,cicloId,gradoId,orientacionId,opcionId,fechaInicioCurso,perId, function(err,result){

      if (err) {
        return res.json({error:202,errstr:err.message});
      }
      return res.json({error:0,quedoInscripto:result});
    });
  },

  hayEntrevistaHoy: function (req, res) {

    var dependId = parseInt(req.param('dependId'));
    var planId = parseInt(req.param('planId'));
    var turnoId = typeof req.param('turnoId') !== 'undefined' ? req.param('turnoId').substr(0,2) : undefined;
    var cicloId = parseInt(req.param('cicloId'));
    var gradoId = parseInt(req.param('gradoId'));
    var orientacionId = parseInt(req.param('orientacionId'));
    var opcionId = parseInt(req.param('opcionId'));
    var fechaInicioCurso = typeof req.param('fechaInicioCurso') !== 'undefined' ? new Date(req.param('fechaInicioCurso').substr(0,10)+"T05:00:00.000Z") : undefined;
    var perId = parseInt(req.param('perId'));

    if (!dependId || !planId || !turnoId || !cicloId || !gradoId || !orientacionId || !opcionId || !fechaInicioCurso || !perId) {
      return res.json({error:301,errstr:"Parámetros incorrectos"});
    }

    Reserva.findOne({DependId:dependId,PlanId:planId,TurnoId:turnoId,CicloId:cicloId,GradoId:gradoId,
                    OrientacionId:orientacionId,OpcionId:opcionId,FechaInicioCurso:fechaInicioCurso,PerId:perId}).exec(function(err,reserva){

      if (err) {
        return res.json({error:302,errstr:err.message});
      }
      if (!reserva || typeof reserva.id === 'undefined') {
        return res.json({error:0,hayEntrevistaHoy:false});
      }
      console.log("reserva:"+reserva.id);
      Entrevista.findOne({Reserva:reserva.id,Activa:true}).exec(function(err,entrevista){
        if (err) {
          return res.json({error:303,errstr:err.message});
        }
        if (!entrevista || typeof entrevista.id === 'undefined') {
          return res.json({error:0,hayEntrevistaHoy:false});
        }
        console.log("entrevista:"+entrevista.id);
        return res.json({error:0,hayEntrevistaHoy:true});
      });
    });
  },
};
