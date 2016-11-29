/**
 * LocalidadesController
 *
 * @description :: Server-side logic for managing Localidades
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// deshabilito las funciones blueprint que hacen modificaciones
	create: function() { return;},
	update: function() { return;},
	destroy: function() { return;},
	populate: function() { return;},
	add: function() { return;},
	remove: function() { return;},
	conLiceo: function(req,res) {
		var deptoId = parseInt(req.param('DeptoId'));
		if(! Number.isInteger(deptoId) ) {
			return res.json(500,{message:"parámetros incorrectos"});
		}
		Localidades.conLiceo(deptoId, function(err,localidades){
			if (err) {
				console.log(err);
					return res.json(500,{message:err.message});
			}
			res.json(localidades);
		});
	},
};
