function mensaje(t) {
  if (t==="") {
    $('#mensaje').hide();
  } else {
    $('#mensaje').html(t);
    $('#mensaje').show();
  }
}

// document ready
$(document).ready(function() {
  mensaje(typeof textoMensaje !== 'undefined' ? textoMensaje : '');

  // inicialización de los dropdown-menu
  $("ul.dropdown-menu").each(function(index,obj){
    var campo = $(this).attr('dd');
    var val = $('#dd-'+campo).val();
    if (typeof val !== 'undefined' && val!=="") {
      var texto = $("ul.dropdown-menu[dd="+campo+"] li a[data='"+val+"']").text();
      // actualizo etiqueta del botón
      $('#btn-dd-'+campo).html( texto + ' <span class="caret"></span>');
    }
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
     obj.attr('src', '/images/template.jpg');
   };
   img.src = "/images/"+ obj.attr('data') +".jpg";
   if (obj.attr('data') === 'undefined') {
     console.log(obj);
   }
  });
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
  $('#perdocid-adulto').removeClass('red');
  $('#telefono-adulto').removeClass('red');

  if ($('#perdocid').val() === "") {
    mensaje("Debe ingresar el número de documento del alumno");
    $('#perdocid').addClass('red');
    return 0;
  }
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
  mensaje('');
  return 1;
};

$("div#paso1 #btn-paso1").click(function(e){
  if (!validate_paso1()) {
    e.preventDefault();
  }
});

// Identificación del alumno:
$("#dd-pais a").click(function() {
  $('#pais').val( $(this).attr('data-value') );
  $('#lbl-pais').text( $(this).text());
  // cambio el tipo de documento dependiendo del país seleccionado:
  if ($('#pais').val() === "UY") {
    $('#doccod').val("CI");
    $('#lbl-doccod').text( "Cédula de Identidad" );
  } else {
    $('#doccod').val("PSP");
    $('#lbl-doccod').text( "Pasaporte" );
  }
});

$("#dd-doccod a").click(function() {
  $('#doccod').val( $(this).attr('data-value') );
  $('#lbl-doccod').text( $(this).text());
});

// Identificación del adulto:
$("#dd-pais-adulto a").click(function() {
  $('#pais-adulto').val( $(this).attr('data-value') );
  $('#lbl-pais-adulto').text( $(this).text());
  // cambio el tipo de documento dependiendo del país seleccionado:
  if ($('#pais-adulto').val() === "UY") {
    $('#doccod-adulto').val("CI");
    $('#lbl-doccod-adulto').text( "Cédula de Identidad" );
  } else {
    $('#doccod-adulto').val("PSP");
    $('#lbl-doccod-adulto').text( "Pasaporte" );
  }
});

$("#dd-doccod-adulto a").click(function() {
  $('#doccod-adulto').val( $(this).attr('data-value') );
  $('#lbl-doccod-adulto').text( $(this).text());
});

$("#btn-back").click(function(e){
  e.preventDefault();
  document.location.replace( $(this).attr("name") );
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
    // inicialización del botón, copiado de document.ready
    var campo = $('#ul-dd-localidad').attr('dd');
    var val = $('#dd-'+campo).val();
    if (typeof val !== 'undefined' && val!=="") {
      var texto = $("ul.dropdown-menu[dd="+campo+"] li a[data='"+val+"']").text();
      // actualizo etiqueta del botón
      $('#btn-dd-'+campo).html( texto + ' <span class="caret"></span>');
    }
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
    return 0;
  }
  mensaje('');
  return 1;
};

$("div#paso3 #btn-paso4").click(function(e){
  if (!validate_paso3()) {
    e.preventDefault();
  }
});

/*************************
 **  PASO 4
 *************************/

$("div#paso3 #btn-paso5").click(function(e){
 if (!validate_paso4()) {
   e.preventDefault();
 }
});

/*************************
 **  PASO 5
 *************************/

if ($('input#Fecha')) {
  // datepicker:
  $('input#Fecha').datepicker({
      format: "yyyy-mm-dd",
      todayBtn: "linked",
      language: "es",
      daysOfWeekDisabled: "0",
      todayHighlight: true,
      startDate: '2016-12-27',
      autoclose: true,
  });

  $('input#Fecha').change(function(){
    $('#btn-paso6').addClass('disabled');
    $.getJSON("../entrevista/horasDisponibles?DependId="+$('#DependId').val()+"&Fecha="+$(this).val(), function(data) {
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
      }
    });
  });

  $('input#dd-hora').change(function(){
    if ($(this).val().match(/^[0-9][0-9]:[0-9][0-9]/)) {
      $('#btn-paso6').removeClass('disabled');
    }
  });
}

function ruee(dependId) {
  var deptoId = floor(dependId/100);
  // paso el depto a la codificación que usa CODICEN
  deptoId = (deptoId<10 ? deptoId+1 : (deptoId>10 ? deptoId : 1));
  // calculo el ruee
  return 1200000 + deptoId*1000 + dependId%100;
}
