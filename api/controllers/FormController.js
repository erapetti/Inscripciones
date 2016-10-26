/**
 * FormController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	paso1: function (req, res) {

		Paises.find({PaisVer:'S'}).exec(function(err, paises){
			if (err) {
					return res.serverError(err);
			}

			return res.view({paises:paises});
		});
	},
	paso2: function (req, res) {

		var pais = req.param('pais');
		var doccod = req.param('doccod');
		var perdocid = req.param('perdocid');

		// valido los parámetros
		if (!pais.match('^[A-Z][A-Z]$') && !doccod.match('^[A-Z]+$') && !perdocid.match('^[a-zA-Z0-9 -]+$')) {
			return res.serverError(new Error("documento de alumno inválido"));
		}

		// obtengo el id del alumno:
		Personas.buscar(pais,doccod,perdocid,function(err, persona){
			if (err) {
				return res.serverError(err);
			}

			if (typeof persona === 'undefined') {
				return res.view({mensaje:"No se encuentra una persona registrada con el documento dado"});
			}

			var inicioCurso = new Date("2016-03-01T03:00:00.000Z");
			Inscripciones.find({perid:persona.perid,EstadosInscriId:1,FechaInicioCurso:inicioCurso}).populate('PlanId').exec(function(err,inscripciones) {
				if (err) {
					return res.serverError(err);
				}
				console.log(inscripciones);
				if (typeof inscripciones === 'undefined' || typeof inscripciones[0] === 'undefined') {
					console.log("no hay inscripcion");
					return res.view({mensaje:"No se encuentra una inscripción registrada para el documento dado"});
				}
				return res.view({persona:persona,inscripciones:inscripciones});
			});
		});
	},
};
