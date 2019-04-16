var currentId = "";
var locale = "pt-BR";

$("#create-event-button").click(function(){
    var body = {};
    body.name = $("#event-name").val();
    body.description = $("#event-description").val();
    body.beginDate = $("#event-begin-date").val();
    body.endDate = $("#event-end-date").val();
    body.beginTime = $("#event-begin-time").val();
    body.endTime = $("#event-end-time").val();
    
    $.post("/events", body, function(data){
        $('#add-event-modal').modal('hide');
        var url = '/?createEventSuccess=true';
        window.location.href = url;
    });
});

$(function(){
    $.get("/events", function(data){
        for(event in data.events){
            //Formatar a data de início
            let beginDate = data.events[event].beginDate.split("-");
            let beginTime = data.events[event].beginTime.split(":");

            //Formatar a data de término
            let endDate = data.events[event].endDate.split("-");
            let endTime = data.events[event].endTime.split(":");

            var newEvent = document.createElement('div');
            newEvent.innerHTML = `
                <div id="`+data.events[event]._id+`" class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${data.events[event].name}</h5>
                        <small>Início: ${beginDate[2]}/${beginDate[1]}/${beginDate[0]}, ${beginTime[0]}:${beginTime[1]} - 
                        Término: ${endDate[2]}/${endDate[1]}/${endDate[0]}, ${endTime[0]}:${endTime[1]}</small>
                    </div>
                    <p class="mb-1">${data.events[event].description}</p>
                    <button class="btn btn-primary edit-event-button">Editar evento</button>
                    <button class="btn btn-danger delete-event-button">Excluir evento</button>
                </div>
            `;
            document.querySelector("#event-list").appendChild(newEvent);
        }
    });
});

$(document).on("click", "#add-event-button", function(){
    $("#add-event-modal").modal("show");
});

$(document).on("click", ".edit-event-button", function(){
    $("#edit-event-modal").modal("show");
    currentId = $(this).parent().attr("id");
});

$(document).on("click", "#edit-form-event-button", function(){
    
    var body = {};
    body.name = $("#event-name-edit").val();
    body.description = $("#event-description-edit").val();
    body.beginDate = $("#event-begin-date-edit").val();
    body.endDate = $("#event-end-date-edit").val();
    body.beginTime = $("#event-begin-time-edit").val();
    body.endTime = $("#event-end-time-edit").val();
    
    $.ajax({
        url: `/events/${currentId}`,
        type: 'PUT',
        data: body,
        success: function(response) {
            currentId = "";
            $("#edit-event-modal").modal("hide");
            window.location.href="?editEventSuccess=true";
        }
    });
});

$(document).on("click", ".delete-event-button", function(){
    if(confirm("Deseja mesmo deletar este evento?")){
        currentId = $(this).parent().attr("id");
        $.ajax({
            url: `/events/${currentId}`,
            type: 'DELETE',
            success: function(response) {
                currentId = "";
                window.location.href = "/?deleteEventSuccess=true";
            }
        });
    }
});

$(function(){
    
    var fade_out = function() {
        $(".alert-changes-made").fadeOut().empty();
      }
      
      setTimeout(fade_out, 5000);
});