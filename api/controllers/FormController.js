/**
 * FormController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// métodos del modelo:
	paso1: function (req, res) {

		req.session.authenticated = 1;

		Paises.find({PaisVer:'S'}).exec(function(err, paises){
			if (err) {
					return res.serverError(err);
			}

			return res.view({paises:paises,sesion:req.session});
		});
	},

	paso2: function (req, res) {

		var pais = req.param('pais') ? req.param('pais').substr(0,2) : req.session.pais;
		var doccod = req.param('doccod') ? req.param('doccod').substr(0,3) : req.session.doccod;
		var perdocid = req.param('perdocid') ? req.param('perdocid').substr(0,15) : req.session.perdocid;
		var perdocid_adulto = req.param('perdocid-adulto') ? req.param('perdocid-adulto').substr(0,15) : req.session.perdocid_adulto;
		var telefono_adulto = req.param('telefono-adulto') ? req.param('telefono-adulto').substr(0,15) : req.session.telefono_adulto;

		if (!req.session.perdocid || perdocid!=req.session.perdocid) {
				// salvo la cantidad de intentos con cédulas diferentes para evitar abusos
				req.session.intentos += 1;
		}
		req.session.pais = pais;
		req.session.doccod = doccod;
		req.session.perdocid = perdocid;
		req.session.perdocid_adulto = perdocid_adulto;
		req.session.telefono_adulto = telefono_adulto;

		turnosDesc={'1':'Matutino', '2':'Tarde', '3':'Vespertino', '4':'Nocturno', 'D':'Diurno', 'N':'Nocturno'};

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
			req.session.inicioCurso = inicioCurso;

			Inscripciones.find({PerId:persona.perid,EstadosInscriId:1,FechaInicioCurso:inicioCurso})
									 .sort('InscripcionId DESC')
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
				Dependencias.direccion(inscripciones[0].DependId.DependId, function(err, direccion) {
					if (err) {
						return res.serverError(err);
					}
					return res.view({persona:persona,inscripciones:inscripciones,direccion:direccion,turnosDesc:turnosDesc});
				});
			});
		});
	},

	paso3: function (req, res) {
		var planId = req.param('planId') ? parseInt(req.param('planId')) : req.session.planId;
		var cicloId = req.param('cicloId') ? parseInt(req.param('cicloId')) : req.session.cicloId;
		var gradoId = req.param('gradoId') ? parseInt(req.param('gradoId')) : req.session.gradoId;
		var orientacionId = req.param('orientacionId') ? parseInt(req.param('orientacionId')) : req.session.orientacionId;
		var opcionId = req.param('opcionId') ? parseInt(req.param('opcionId')) : req.session.opcionId;
		var turnoId = req.param('turnoId') ? req.param('turnoId').substr(0,1) : req.session.turnoId;

		req.session.planId = planId;
		req.session.cicloId = cicloId;
		req.session.gradoId = gradoId;
		req.session.orientacionId = orientacionId;
		req.session.opcionId = opcionId;
		req.session.turnoId = turnoId;

		return res.view({departamento:{},localidad:{}});
	},

	paso4: function (req, res) {
		var deptoId = req.param('departamento') ? parseInt(req.param('departamento')) : req.session.deptoId;
		var locId = req.param('localidad') ? parseInt(req.param('localidad')) : req.session.locId;

		req.session.deptoId = deptoId;
		req.session.locId = locId;

		var planId = req.session.planId;
		var cicloId = req.session.cicloId;
		var gradoId = req.session.gradoId;
		var orientacionId = req.session.orientacionId;
		var opcionId = req.session.opcionId;
		var turnoId = req.session.turnoId;
		var inicioCurso = new Date(req.session.inicioCurso);

		if (!deptoId || !locId || !planId || !cicloId || !gradoId || !orientacionId || !opcionId || !turnoId || !inicioCurso) {
				console.log(deptoId,locId,planId,cicloId,gradoId,orientacionId,opcionId,turnoId,inicioCurso);
				return res.serverError(new Error("parámetros incorrectos"));
		}

		Cupos.conLugar(deptoId,locId,planId,cicloId,gradoId,orientacionId,opcionId,inicioCurso,function(err,liceos){
			if (err) {
				return res.serverError(err);
			}

			return res.view({liceos:liceos});
		});
	},
};
