/**
 * Cupos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Estudiantil',
//  autoCreatedAt: false,
//  autoUpdatedAt: false,
//  autoPK: false,
//  migrate: 'safe',
  tableName: 'CUPOS',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
    },
    DependId: { model: 'Dependencias' },
    PlanId: { model: 'Planes' },
    TurnoId: 'string',
    CicloId: { model: 'Ciclos' },
    GradoId: { model: 'Grados' },
    OrientacionId: { model: 'Orientaciones' },
    OpcionId: { model: 'Opciones' },
    FechaInicioCurso: 'date',
    Grupos: 'integer',
    AlumnosPorGrupo: 'integer',
  },
  conLugar: function(DeptoId,LocId,PlanId,CicloId,GradoId,OrientacionId,OpcionId,FechaInicioCurso,callback) {
    return this.query(`
      SELECT DependId, DependDesc, DependNom, LugarDireccion, LocNombre, DeptoNombre, TurnoId, Grupos * AlumnosPorGrupo - (
        -- inscriptos
        SELECT count(*)
        FROM INSCRIPCIONES i
        WHERE i.DependId=c.DependId
          AND i.PlanId=c.PlanId
          AND (InscriTurno is null or InscriTurno<>'N')
          AND i.CicloId=c.CicloId
          AND i.GradoId=c.GradoId
          AND i.OrientacionId=c.OrientacionId
          AND i.OpcionId=c.OpcionId
          AND i.FechaInicioCurso=c.FechaInicioCurso
          AND EstadosInscriId<5
      ) saldo
      FROM CUPOS c
      JOIN Direcciones.DEPENDLUGAR
      USING (DependId)
      JOIN Direcciones.LUGARES l
      USING (LugarId)
      JOIN Direcciones.DEPENDENCIAS d
      USING (DependId)
      JOIN Direcciones.LOCALIDAD
      USING (DeptoId,LocId)
      JOIN Direcciones.DEPARTAMENTO
      USING (DeptoId)
      WHERE DeptoId=?
        AND LocId=?
        AND PlanId=?
        AND CicloId=?
        AND GradoId=?
        AND OrientacionId=?
        AND OpcionId=?
        AND FechaInicioCurso=?
        AND l.StatusId=1
        AND d.StatusId=1
      HAVING saldo>0
    `,
    [DeptoId,LocId,PlanId,CicloId,GradoId,OrientacionId,OpcionId,FechaInicioCurso],
    function(err,result){
      if (err) {
        return callback(err, undefined);
      }
      if (result===null) {
        return new Error("No se encuentra el curso pedido",undefined);
      }
      return callback(undefined, (result===null ? undefined : result));
    });
  },
};
