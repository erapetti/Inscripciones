/**
 * Personas.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Personas',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  migrate: 'safe',
  attributes: {
    perid: 'integer',
    pernombrecompleto: 'string',
  },

  buscar: function(paiscod,doccod,perdocid,callback) {
    return this.query(`
      SELECT perid,pernombrecompleto
      FROM PERSONAS
      JOIN PERSONASDOCUMENTOS
      USING (PerId)
      WHERE PAISCOD=?
        AND DOCCOD=?
        AND PERDOCID=?
      LIMIT 1
    `,
    [paiscod,doccod,perdocid],
    function(err,result){
      if (err) {
        return callback(err, undefined);
      }
      if (result===null) {
        return callback(new Error("No se pueden obtener los datos de la persona"),undefined);
      }
      return callback(undefined, result[0])
    });
  },
};
