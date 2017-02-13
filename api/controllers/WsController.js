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
    var fechaInicioCurso = typeof req.param('fechaInicioCurso') !== 'undefined' ? new Date(req.param('fechaInicioCurso').substr(0,10)) : undefined;

    if (!dependId || !planId || !turnoId || !cicloId || !gradoId || !orientacionId || !opcionId || !fechaInicioCurso) {
      return res.json({error:101,errstr:"Parámetros incorrectos"});
    }

    Cupos.conLugar2(dependId,planId,turnoId,cicloId,gradoId,orientacionId,opcionId,fechaInicioCurso,function(err,dependencias){
      if (err) {
        return res.json({err:103,errstr:err.message});
      }
      return res.json({err:0,conLugar:(typeof dependencias[0] !== "undefined" && dependencias[0].saldo > 0)});
    });
  },
};
