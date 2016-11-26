/**
 * Dependencias.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Direcciones',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  migrate: 'safe',
  tableName: 'DEPENDENCIAS',
  identity: 'Dependencias',
  attributes: {
          DependId: {
                  type: 'integer',
                  primaryKey: true
          },
          DependDesc: 'string',
          DependNom: 'string',
          StatusId: 'integer',
  },

  direccion: function(DependId, callback) {
    return this.query(`
      SELECT DeptoId,DeptoNombre,LugarId,LugarDesc,LocId,LocNombre,LugarDireccion
      FROM DEPENDENCIAS d
      JOIN DEPENDLUGAR USING (DependId)
      JOIN LUGARES USING (LugarId)
      JOIN DEPARTAMENTO USING (DeptoId)
      JOIN LOCALIDAD USING (DeptoId,LocId)
      WHERE DependId = ?
      LIMIT 1
    `,
    [DependId],
    function(err,result){
      if (err) {
        return callback(err, undefined);
      }
      if (result===null) {
        return new Error("No se encuentra la dependencia",undefined);
      }
      return callback(undefined, (result===null ? undefined : result));
    });
  },

};
