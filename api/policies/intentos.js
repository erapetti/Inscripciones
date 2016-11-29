/**
 * intentos
 *
 * @module      :: Policy
 * @description :: Contro para evitar abusos con intentos repetidos en la misma sesión
 *
 */
module.exports = function(req, res, next) {

  if (req.session.intentos > 10) {
    return res.forbidden('Ud. ha excedido la cantidad máxima de consultas');
  }

  if (!(req.session.intentos>=0)) {
      req.session.intentos=0;
  }

  return next();
};
