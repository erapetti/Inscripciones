use Estudiantil;
alter table reserva_inscripcion add key (PerId);
alter table reserva_inscripcion add key (DependId,PlanId,TurnoId,CicloId,GradoId,OrientacionId,OpcionId,FechaInicioCurso,Vencimiento);
use Direcciones;
alter table transportes add key (DependId);

