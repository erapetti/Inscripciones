function mensaje(t) {
  if (t==="") {
    $('#mensaje').hide();
  } else {
    $('#mensaje').text(t);
    $('#mensaje').show();
  }
}

// document ready
$(document).ready(function() {
  mensaje(typeof textoMensaje !== 'undefined' ? textoMensaje : '');
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
  if ($('#perdocid').val() === "") {
    mensaje("Debe ingresar el número de documento del alumno");
    return 0;
  }
  if ($('#perdocid-adulto').val() === "") {
    mensaje("Debe ingresar el número de documento del adulto");
    return 0;
  }
  if ($('#telefono-adulto').val() === "") {
    mensaje("Debe ingresar el número de teléfono del adulto");
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



/*************************
 **  PASO 2
 *************************/

 $("div#paso2 #btn-paso1").click(function(e){
   history.go(-1);
   e.preventDefault();
 });

 $("div#paso2 #btn-paso3").click(function(e){
   if (!validate_paso2()) {
     e.preventDefault();
   }
 });


 /*************************
  **  PASO 3
  *************************/


// datepicker:
$('div#date').datepicker({
    format: "dd/mm/yyyy",
    todayBtn: "linked",
    language: "es",
    daysOfWeekDisabled: "0",
    todayHighlight: true
});
