function mensaje(t) {
  if (t==="") {
    $('#mensaje').hide();
  } else {
    $('#mensaje').html(t);
    $('#mensaje').show();
    //$("html, body").animate({scrollTop: $('#mensaje').offset().top}, 1000);
  }
};

// inicialización de los dropdown-menu
function ddInit(btn) {
  var campo = btn.attr('dd');
  var opciones = $("ul.dropdown-menu[dd="+campo+"] li a").length;
  if (!(opciones>1)) {
    $('#dd-'+campo).val( $("ul.dropdown-menu[dd="+campo+"] li a").attr("data") );
    $('#dd-'+campo).change();
  }
  var val = $('#dd-'+campo).val();
  if (typeof val !== 'undefined' && val!=="") {
    var texto = $("ul.dropdown-menu[dd="+campo+"] li a[data='"+val+"']").first().text();
    // actualizo etiqueta del botón
    $('#btn-dd-'+campo).html( texto + (opciones>1 ? ' <span class="caret"></span>' : ''));
  }
  if (opciones>1) {
    $('#btn-dd-'+campo).removeClass('disabled unicaopcion');
  } else {
    $('#btn-dd-'+campo).addClass('disabled unicaopcion');
  }
};

// document ready
$(document).ready(function() {
  mensaje(typeof textoMensaje !== 'undefined' ? textoMensaje : '');

  // inicialización de los dropdown-menu
  $("ul.dropdown-menu").each(function(index,obj){
    ddInit($(this));
  });
  // función para actualizar los dropdown-menu cuando el usuario selecciona una opción
  $(document).on("click","ul.dropdown-menu li a",function(event) {
    event.preventDefault();
    // actualizo etiqueta del botón
    $('#btn-dd-'+$(this).attr('dd')).html( $(this).text() + ' <span class="caret"></span>');
    // actualizo input
    $('#dd-'+$(this).attr('dd')).val( $(this).attr('data') );
    $('#dd-'+$(this).attr('dd')).change();
  });
  // carga de las imágenes de los liceos
  $('img.img-liceo').each(function() {
   var img = new Image();
   var obj = $(this);
   img.onload = function() {
     obj.attr('src', img.src);
   };
   img.onerror = function() {
     obj.attr('src', '../images/template.jpg');
   };
   img.src = '../images/'+ obj.attr('data') +".jpg";
  });
  // en el paso 5 cargo el dropdown de horas
  if ($('input#Fecha').length>0 && $('input#Fecha').val() !== '') {
    actualizoHoras();
  }
});

$("#btn-back").click(function(e){
  e.preventDefault();
  document.location.replace( $(this).attr("name") );
});

/*************************
**  INICIO
*************************/

$('#arrow').click(function() {
  $("html, body").animate({ scrollTop: $("#s1").offset().top }, 1000);
});


/*************************
 **  PASO 1
 *************************/

function validate_paso1() {
  $('#perdocid').removeClass('red');

  if ($('#perdocid').val() === "") {
    mensaje("Debe ingresar el número de documento del alumno");
    $('#perdocid').addClass('red');
    return 0;
  }
  mensaje('');
  return 1;
};

$("div#paso1 #btn-paso1").click(function(e){
  if (!validate_paso1()) {
    e.preventDefault();
  }
});

/*************************
 **  PASO 2
 *************************/

/*************************
 **  PASO 3
 *************************/

$('#dd-departamento').change(function() {
  // actualizo la etiqueta del botón
  $('#btn-dd-localidad').html( "Seleccione una localidad" + ' <span class="caret"></span>');
  // actualizo input
  $('#dd-localidad').val("");
  actualizoLocalidades();
});

function actualizoLocalidades(){
  // obtengo las localidades del departamento seleccionado
  $.getJSON("../localidades/conLiceo?DeptoId="+$('#dd-departamento').val(), function(data) {
    $('#ul-dd-localidad').html(''); // borro las opciones que tenía
    data.forEach(function(loc) {
      $('#ul-dd-localidad').append('<li><a href="#" dd="localidad" data="'+loc.LocId+'">'+loc.LocNombre+'</a></li>');
    });
    if (data.length==1) {
      $('#dd-localidad').val(data[0].LocId);
    }
    // reinicialización del botón
    ddInit($('#ul-dd-localidad'));
  });
};

if ($('#dd-departamento').val() > 0) {
  actualizoLocalidades(); // inicialización
}

function validate_paso3() {
  $('button.dropdown-toggle').removeClass('red');
  var error = 0;
  $('input').each(function(index){
    if ($(this).val() === "") {
      $('#btn-'+$(this).attr('id')).addClass('red');
      error = 1;
    }
  });
  if (error) {
    mensaje("Debe ingresar todos los valores solicitados");
    return false;
  }
  mensaje('');
  return true;
};

$("div#paso3 #btn-paso4").click(function(e){
  if (!validate_paso3()) {
    e.preventDefault();
  }
});

/*************************
 **  PASO 4
 *************************/

function validate_paso4() {
  return true;
};

$("div#paso3 #btn-paso5").click(function(e){
 if (!validate_paso4()) {
   e.preventDefault();
 }
});

/*************************
 **  SIN CUPO
 *************************/

function validate_sinCupo() {
  var error = 0;
  $('input').each(function(index){
    if ($(this).val() === "") {
      $('#btn-'+$(this).attr('id')).addClass('red');
      $('#'+$(this).attr('id')).addClass('red');
      error = 1;
    } else {
      $('#btn-'+$(this).attr('id')).removeClass('red');
      $('#'+$(this).attr('id')).removeClass('red');
    }
  });
  if (! $('#confirma').prop('checked')) {
    $('#btn-confirma').addClass('red');
    error = 1;
  } else {
    $('#btn-confirma').removeClass('red');
  }
  if (error) {
    mensaje("Debe ingresar todos los valores solicitados");
    return false;
  }
  if ($('#dd-liceo1').val() === $('#dd-liceo2').val()) {
    mensaje("Los liceos seleccionados deben ser diferentes");
    return false;
  }
  mensaje('');
  return true;
};

$("div#sinCupo #btn-sinCupoGuardar").click(function(e){
 if (!validate_sinCupo()) {
   e.preventDefault();
 }
});

/*************************
 **  PASO 5
 *************************/

if ($('input#Fecha').length>0) {
  // datepicker:
  $('input#Fecha').datepicker({
      format: "yyyy-mm-dd",
      todayBtn: "linked",
      language: "es",
      daysOfWeekDisabled: "0",
      todayHighlight: true,
      startDate: '2016-12-27',
      autoclose: true,
      disableTouchKeyboard: true,
      maxViewMode: 'months',
  });

  function actualizoHoras() {
    //$('#btn-paso6').addClass('disabled');
    $.getJSON("../entrevista/horasDisponibles?DependId="+$('#DependId').val()+"&Fecha="+$('input#Fecha').val(), function(data) {
      $('#ul-dd-hora').html(''); // borro las opciones que tenía
      if (typeof data[0] === 'undefined') {
        $('#btn-dd-hora').html('---');
        $('#btn-dd-hora').addClass('disabled');
        mensaje('No hay horarios disponibles para el día seleccionado')
      } else {
        $('#btn-dd-hora').html('Seleccione una hora <span class="caret"></span>');
        $('#btn-dd-hora').removeClass('disabled');
        data.forEach(function(disponible) {
          $('#ul-dd-hora').append('<li><a href="#" dd="hora" data="'+disponible.Hora+'">'+disponible.Hora+'</a></li>');
        });
        mensaje('');
        ddInit($('#ul-dd-hora'));
      }
    });
  };
  $('input#Fecha').change(actualizoHoras);

//  $('input#dd-hora').change(function(){
//    validate_paso5();
//  });
}
function validate_paso5() {
  $('#perdocid-adulto').removeClass('red');
  $('#telefono-adulto').removeClass('red');
  $('input#Fecha').removeClass('red');
  $('input#dd-hora').removeClass('red');
  if ($('#perdocid-adulto').val() === "") {
    mensaje("Debe ingresar el número de documento del adulto");
    $('#perdocid-adulto').addClass('red');
    return 0;
  }
  if ($('#telefono-adulto').val() === "") {
    mensaje("Debe ingresar el número de teléfono del adulto");
    $('#telefono-adulto').addClass('red');
    return 0;
  }
  if (! $('input#Fecha').val().match(/^ *[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] *$/)) {
    mensaje("Debe seleccionar un día para la entrevista");
    $('input#Fecha').addClass('red');
    return 0;
  }
  if (! $('input#dd-hora').val().match(/^[0-9][0-9]:[0-9][0-9]/)) {
    mensaje("Debe seleccionar una hora para la entrevista");
    $('input#dd-hora').addClass('red');
    return 0;
  }
  //$('#btn-paso6').removeClass('disabled');
  mensaje('');
  return 1;
};
$("div#paso5 #btn-paso6").click(function(e){
  if (!validate_paso5()) {
    e.preventDefault();
  }
});

function ruee(dependId) {
  var deptoId = floor(dependId/100);
  // paso el depto a la codificación que usa CODICEN
  deptoId = (deptoId<10 ? deptoId+1 : (deptoId>10 ? deptoId : 1));
  // calculo el ruee
  return 1200000 + deptoId*1000 + dependId%100;
}
