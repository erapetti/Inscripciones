/**
 * Cupos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Estudiantil',
  autoPK: false,
  migrate: 'safe',
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
  conLugar: function(DeptoId,LocId,PlanId,CicloId,GradoId,OrientacionId,OpcionId,FechaInicioCurso,DependIdActual,callback) {
    return this.query(`
      SELECT DependId, DependDesc, DependNom, LocId, LocNombre, DeptoNombre, sum(Grupos) * min(AlumnosPorGrupo) - (
        SELECT count(*) inscriptos
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
      ) - (
        SELECT count(*) reservas
        FROM reserva_inscripcion r
        WHERE r.DependId=c.DependId
          AND r.PlanId=c.PlanId
          AND (r.TurnoId is null or r.TurnoId<>'N')
          AND r.CicloId=c.CicloId
          AND r.GradoId=c.GradoId
          AND r.OrientacionId=c.OrientacionId
          AND r.OpcionId=c.OpcionId
          AND r.FechaInicioCurso=c.FechaInicioCurso
          AND r.Vencimiento>now()
      ) - 50 saldo,
      concat(DirViaNom,if(DirNroPuerta is null,'',concat(' ',DirNroPuerta)),if(DirViaNom1 is null,'',if(DirViaNom2 is null,concat(' esq. ',DirViaNom1),concat(' entre ',DirViaNom1,if(DirViaNom2 like 'i%' or DirViaNom2 like 'hi%',' e ',' y '),DirViaNom2)))) LugarDireccion,
      transportes
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
      JOIN Direcciones.DIRECCIONES
      ON LugarDirId=DirId
      LEFT JOIN (select DependId,group_concat(distinct(transportes) ORDER BY transportes SEPARATOR ', ') transportes from Direcciones.transportes group by DependId) t
      USING (DependId)
      WHERE DeptoId=?
        AND LocId=?
        AND PlanId=?
        AND CicloId=?
        AND GradoId=?
        AND OrientacionId=?
        AND OpcionId=?
        AND FechaInicioCurso=?
        AND DependId<>?
        AND l.StatusId=1
        AND d.StatusId=1
        AND LugarId=DependId
      GROUP BY DeptoId,LocId,DependId,DirId
      HAVING saldo>0
    `,
    [DeptoId,LocId,PlanId,CicloId,GradoId,OrientacionId,OpcionId,FechaInicioCurso.fecha_ymd_toString(),DependIdActual],
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

Date.prototype.fecha_ymd_toString = function() {
        var sprintf = require("sprintf");
        return sprintf("%04d-%02d-%02d", this.getFullYear(),this.getMonth()+1,this.getDate());
};
