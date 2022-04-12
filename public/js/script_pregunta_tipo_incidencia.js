$(document).ready(function () {
    $('.form-select-label').selectpicker();
});

$(document).on('keyup', '.form-select-label .bs-searchbox input', function (e) {
    var input = e.target.value;
    if(document.getElementsByClassName("no-results").length == 1)
    {
        document.getElementsByClassName("no-results")[0].innerHTML = "No se encontro la pregunta " + input;

        if(input.length > 30)
        {
            document.getElementsByClassName("no-results")[0].innerHTML += '<button type="button" disabled id="agregaPregunta">Agregar</button>';
        }
        else
        {
            document.getElementsByClassName("no-results")[0].innerHTML += '<button type="button" id="agregaPregunta">Agregar</button>';
        }
        
        document.getElementById("agregaPregunta").addEventListener('click', function (event) {

            let preguntas_actuales = document.querySelector('[data-id="select_preguntas"]').title.split(", ");

            for(pregunta of preguntas_actuales)
            {
                document.getElementById(pregunta).setAttribute('selected', true);
            }

            let select_preguntas = document.getElementById("select_preguntas");
            
            select_preguntas.innerHTML = '<option id=' + input + ' value=' + input + '>' + input + '</option>' + select_preguntas.innerHTML;
            $('.form-select-label').selectpicker('refresh');
            event.stopPropagation();
        });
    }

});