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

		if (!req.session.perdocid || perdocid!=req.session.perdocid) {
				// salvo la cantidad de intentos con cédulas diferentes para evitar abusos
				req.session.intentos += 1;
		}

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

					// salvo los parámetros en la sesión
					req.session.pais = pais;
					req.session.doccod = doccod;
					req.session.perdocid = perdocid;
					// salvo en la sesión el resto de la información
					req.session.persona = persona;
					req.session.inscripciones = inscripciones;
					req.session.direccion = direccion;

					return res.view({persona:persona,inscripciones:inscripciones,direccion:direccion,turnosDesc:turnosDesc});
				});
			});
		});
	},

	paso3: function (req, res) {
		var deptoId = typeof req.session.direccion.DeptoId !== "undefined" ? req.session.direccion.DeptoId : undefined;
		var locId = typeof req.session.direccion.LocId !== "undefined" ? req.session.direccion.LocId : undefined;

		if (!deptoId || !locId || typeof req.session.inscripciones !== "object") {
			return res.serverError(new Error("Parámetros incorrectos"));
		}

		// Armo opciones de plan-ciclo-grado-orientacion-opcion según las inscripciones que tiene
		var planes = Array();
		var ciclos = Array();
		var grados = Array();
		var orientaciones = Array();
		var opciones = Array();
		req.session.inscripciones.forEach(function(inscripcion){
			planes[inscripcion.PlanId.PlanId] = inscripcion.PlanId.PlanNombre;
			ciclos[inscripcion.CicloId.CicloId] = inscripcion.CicloId.CicloDesc;
			grados[inscripcion.GradoId.GradoId] = inscripcion.GradoId.GradoDesc;
			orientaciones[inscripcion.OrientacionId.OrientacionId] = inscripcion.OrientacionId.OrientacionDesc;
			opciones[inscripcion.OpcionId.OpcionId] = inscripcion.OpcionId.OpcionDesc;
		});

		if (planes.length==0 || ciclos.length==0 || grados.length==0 || orientaciones.length==0 || opciones.length==0) {
			return res.serverError(new Error("Parámetros incorrectos"));
		}

		// valores por defecto tomados de la sesión
		req.session.planId = req.session.planId || req.session.inscripciones[0].PlanId.PlanId;
		req.session.cicloId = req.session.cicloId || req.session.inscripciones[0].CicloId.CicloId;
		req.session.gradoId = req.session.gradoId || req.session.inscripciones[0].GradoId.GradoId;
		req.session.orientacionId = req.session.orientacionId || req.session.inscripciones[0].OrientacionId.OrientacionId;
		req.session.opcionId = req.session.opcionId || req.session.inscripciones[0].OpcionId.OpcionId;

		return res.view({deptoId:deptoId,locId:locId,
										 planes:planes,ciclos:ciclos,grados:grados,orientaciones:orientaciones,opciones:opciones,
										 planId:req.session.planId,cicloId:req.session.cicloId,gradoId:req.session.gradoId,
									   orientacionId:req.session.orientacionId,opcionId:req.session.opcionId
									 });
	},

	paso4: function (req, res) {
		var deptoId = req.param('departamento') ? parseInt(req.param('departamento')) : req.session.deptoId;
		var locId = req.param('localidad') ? parseInt(req.param('localidad')) : req.session.locId;
		var planId = req.param('plan') ? parseInt(req.param('plan')) : req.session.planId;
		var cicloId = req.param('ciclo') ? parseInt(req.param('ciclo')) : req.session.cicloId;
		var gradoId = req.param('grado') ? parseInt(req.param('grado')) : req.session.gradoId;
		var orientacionId = req.param('orientacion') ? parseInt(req.param('orientacion')) : req.session.orientacionId;
		var opcionId = req.param('opcion') ? parseInt(req.param('opcion')) : req.session.opcionId;

		var turnoId = 'D'; // por ahora sólo tenemos turno diurno
		var inicioCurso = new Date(req.session.inicioCurso);

		if (!deptoId || !locId || !planId || !cicloId || !gradoId || !orientacionId || !opcionId || !turnoId || !inicioCurso) {
				return res.serverError(new Error("parámetros incorrectos"));
		}

		Cupos.conLugar(deptoId,locId,planId,cicloId,gradoId,orientacionId,opcionId,inicioCurso,function(err,liceos){
			if (err) {
				return res.serverError(err);
			}

			req.session.deptoId = deptoId;
			req.session.locId = locId;
			req.session.planId = planId;
			req.session.cicloId = cicloId;
			req.session.gradoId = gradoId;
			req.session.orientacionId = orientacionId;
			req.session.opcionId = opcionId;
			req.session.turnoId = turnoId;
			req.session.liceos = liceos;

			if (typeof liceos[0] === 'undefined') {
				return res.view({mensaje:"No hay liceos con cupos disponibles para el curso seleccionado.<br>Más adelante pueden liberarse cupos si otros estudiantes se cambian de liceo."});
			}

			reservar(perId,planId,cicloId,gradoId,orientacionId,opcionId,function(err,reserva) {
				if (err) {
					return res.serverError(err);
				}

				req.session.reserva = reserva;
				
				return res.view({liceos:liceos});
			});
		});
	},

	paso5: function (req, res) {
		var destinoId = req.param('dependId-destino') ? parseInt(req.param('dependId-destino')) : req.session.destinoId;

		if (!destinoId) {
				return res.serverError(new Error("parámetros incorrectos"));
		}

		if (! req.session.liceos.reduce(function(encontrado,liceo){
					return encontrado || (liceo.DependId == destinoId);
				},false)) {
				// el liceo pedido no está entre los liceos con cupo que le fueron ofrecidos
				return res.serverError(new Error("parámetros incorrectos"));
		}
		req.session.destinoId = destinoId;

		return res.view({});
	},
};
