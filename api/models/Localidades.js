/**
 * Localidades.js
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
  tableName: 'LOCALIDAD',
  identity: 'Localidades',
  attributes: {
          LocId: {
                  type: 'integer',
                  primaryKey: true
          },
          LocNombre: 'string',
          DeptoId: 'integer',
  },
  conLiceo: function(DeptoId,callback) {
    return this.query(`
      SELECT LocId,LocNombre,DeptoId
      FROM LOCALIDAD
      JOIN LUGARES l
      USING (DeptoId,LocId)
      JOIN DEPENDLUGAR
      USING (LugarId)
      JOIN DEPENDENCIAS d
      USING (DependId)
      WHERE DeptoId=?
        AND l.StatusId=1
        AND DependLugarStatusId=1
        AND d.StatusId=1
        AND DependTipId=2
        AND DependSubTipId=1
      GROUP BY DeptoId,LocId
      ORDER BY LocNombre
    `,
    [DeptoId],
    function(err,result){
      if (err) {
        return err
      }
      if (result===null) {
        return new Error("No hay liceos en ese departamento",undefined);
      }
      callback(undefined, result)
    });
  },
};
