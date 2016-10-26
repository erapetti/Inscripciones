/**
 * Inscripciones.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'Estudiantil',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  migrate: 'safe',
  tableName: 'INSCRIPCIONES',
  identity: 'Inscripciones',
  attributes: {
          InscripcionId: {
                  type: 'integer',
                  primaryKey: true
          },
          EstadosInscriId: 'integer',
          DependId: 'integer',
          PerId: {
              type: 'integer',
              key: true
          },
          PlanId: { model: 'Planes' },
          TipoModalidadId: 'integer',
          CicloId: 'integer',
          GradoId: 'integer',
          OrientacionId: 'integer',
          OpcionId: 'integer',
          FechaInicioCurso: 'date',
          InscriTurno: 'string',
  }
};
