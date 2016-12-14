/**
 * EntrevistaController
 *
 * @description :: Server-side logic for managing Entrevista`
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// deshabilito las funciones blueprint que hacen modificaciones
	create: function() { return; },
	update: function() { return; },
	destroy: function() { return; },
	populate: function() { return; },
	add: function() { return; },
	remove: function() { return; },
	horasDisponibles: function(req,res) {
		var dependId = parseInt(req.param('DependId'));
		// paso las fechas a UTCString y lo corro algunas horas porque hace conversión de TimeZone
    var fecha = new Date(req.param('Fecha')+"T05:00:00.000Z");
		if(! Number.isInteger(dependId) || typeof fecha === 'undefined') {
			return res.json(500,{message:"parámetros incorrectos"});
		}
		Entrevista.horasDisponibles(dependId, fecha, function(err,entrevistas){
			if (err) {
        console.log(err);
				return res.json(500,{message:err.message});
			}
			res.json(entrevistas);
		});
	},
};
