function mensaje(t) {
  if (t==="") {
    $('#mensaje').hide();
  } else {
    $('#mensaje').text(t);
    $('#mensaje').show();
  }
}

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
  alert($('#perdocid').val());
  alert($('#perdocid-adulto').val());
  return 1;
};

$("#btn-paso1").click(function(e){
  if (!validate_paso1()) {
    e.preventDefault();
  }
});

// Identificación del alumno:
$("#dd-pais a").click(function() {
  $('#pais').val( $(this).attr('data-value') );
  $('#lbl-pais').text( $(this).text());
});

$("#dd-doccod a").click(function() {
  $('#doccod').val( $(this).attr('data-value') );
  $('#lbl-doccod').text( $(this).text());
});

// Identificación del adulto:
$("#dd-pais-adulto a").click(function() {
  $('#pais-adulto').val( $(this).attr('data-value') );
  $('#lbl-pais-adulto').text( $(this).text());
});

$("#dd-doccod-adulto a").click(function() {
  $('#doccod-adulto').val( $(this).attr('data-value') );
  $('#lbl-doccod-adulto').text( $(this).text());
});

// document ready
$(document).ready(function() {
  mensaje('');
});
