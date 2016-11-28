/**
 * FormController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// métodos del modelo:
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

		turnos={'1':'Matutino', '2':'Tarde', '3':'Vespertino', '4':'Nocturno', 'D':'Diurno', 'N':'Nocturno'};

		// valido los parámetros
		if (!pais || !doccod || !perdocid) {
				return res.serverError(new Error("parámetros incorrectos"));
		}
		if (!pais.match('^[A-Z][A-Z]$') && !doccod.match('^[A-Z]+$') && !perdocid.match('^[a-zA-Z0-9 -]+$')) {
			return res.serverError(new Error("documento de alumno inválido"));
		}

		// obtengo el id del alumno:
		Personas.buscar(pais,doccod,perdocid,function(err, persona){
			if (err) {
				return res.serverError(err);
			}

			if (typeof persona === 'undefined') {
				return res.view({mensaje:"No se encuentra una persona registrada con el documento dado.<br>Si ingresó correctamente el número de documento debe consultar dónde inscribirse en <a href='http://ces.edu.uy/index.php/reguladora-estudiantil'>el sitio web de CES</a>"});
			}

			var inicioCurso = new Date("2016-03-01T03:00:00.000Z");
			Inscripciones.find({PerId:persona.perid,EstadosInscriId:1,FechaInicioCurso:inicioCurso})
									 .sort('InscripcionId DESC')
									 .limit(1)
									 .populate('DependId')
									 .populate('PlanId')
									 .populate('CicloId')
									 .populate('GradoId')
									 .populate('OrientacionId')
									 .populate('OpcionId')
									 .exec(function(err,inscripciones) {
				if (err) {
					return res.serverError(err);
				}
				if (typeof inscripciones === 'undefined' || typeof inscripciones[0] === 'undefined') {
					console.log("no hay inscripcion");
					return res.view({mensaje:"No se encuentra una inscripción registrada para el documento dado"});
				}
				inscripciones[0].TurnoDesc = turnos[inscripciones[0].InscriTurno];
				Dependencias.direccion(inscripciones[0].DependId.DependId, function(err, direccion) {
					if (err) {
						return res.serverError(err);
					}
					return res.view({persona:persona,inscripciones:inscripciones,direccion:direccion[0]});
				});
			});
		});
	},

	paso3: function (req, res) {
		return res.view();
	},

};
