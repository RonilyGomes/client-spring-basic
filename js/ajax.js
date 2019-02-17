$(document).ready(function(){
  loadPeople();

  $("#person_save").click(function() {
    savePerson();
  });
});

function loadPeople() {
  $.ajax({
    url : "http://127.0.0.1:3000/api/v1/people",
    type : 'get',
    dataType: 'json',
  })
  .done(function(response){
    $("#dataTable").html(generateRowsOfTable(response));
  })
  .fail(function(jqXHR, textStatus, msg){
    alert("Ocorreu um erro inesperado!");
  });
}

function generateRowsOfTable(people) {
  result = '';

  $.each(people, function (i, person) {
    result += `<tr>
      <td>
        <span class="custom-checkbox">
          <input type="checkbox" id="checkbox1" name="options[]" value="1">
          <label for="checkbox1"></label>
        </span>
      </td>
      <td>${person.name}</td>
      <td>${person.nickname}</td>
      <td>${person.email}</td>
      <td>${person.phone}</td>
      <td>
        <a href="#editEmployeeModal" class="edit" data-toggle="modal" onclick="loadPerson(${person.id})">
          <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
        </a>
        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal" onclick="loadModalFooterPersonDelete(${person.id})">
          <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
        </a>
      </td>
    </tr>`
  });

  return result;
}

function savePerson() {
  let name = $("#person_name").val();
  let nickname = $("#person_nickname").val();
  let email = $("#person_email").val();
  let phone = $("#person_phone").val();

  $.ajax({
    url : "http://127.0.0.1:3000/api/v1/people",
    type : 'POST',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded",
    data: {
      name: name,
      nickname: nickname,
      email: email,
      phone: phone
    },
  })
  .done(function(response){
    $("#addEmployeeModal").modal('hide');
    alert("cadastrado realizado com sucesso!");
    loadPeople();
  })
  .fail(function(error){
    alert("Ocorreu um erro inesperado");
  });
}

function loadPerson(id) {
  $.ajax({
    url : `http://127.0.0.1:3000/api/v1/people/${id}`,
    type : 'get',
    dataType: 'json',
  })
  .done(function(response){
    $("#modal-body-edit").html(loadDataFromPerson(response));
    $("#modal-footer-edit").html(loadModalFooterPersonEdit(response.id));
  })
  .fail(function(jqXHR, textStatus, msg){
    alert("Ocorreu um erro inesperado");
  });
}

function loadDataFromPerson(person) {
    return `<div class="form-group">
      <label>Nome</label>
      <input type="text" class="form-control" name="name" id="person_name_edit" required value="${person.name}">
    </div>
    <div class="form-group">
      <label>Apelido</label>
      <input type="text" class="form-control" name="nickname" id="person_nickname_edit" required value="${person.nickname}">
    </div>
    <div class="form-group">
      <label>E-mail</label>
      <input type="email" class="form-control" name="email" id="person_email_edit" required value="${person.email}">
    </div>
    <div class="form-group">
      <label>Phone</label>
      <input type="text" class="form-control" name="phone" id="person_phone_edit" required value="${person.phone}">
    </div>`;
}

function loadModalFooterPersonEdit(id) {
  return `<input type="button" class="btn btn-default" data-dismiss="modal" value="Cancelar">
  <input type="submit" class="btn btn-success"
  onclick="event.preventDefault(); editPerson(${id})" value="Alterar" id="person_edit">`
}

function editPerson(id) {
  let name = $("#person_name_edit").val();
  let nickname = $("#person_nickname_edit").val();
  let email = $("#person_email_edit").val();
  let phone = $("#person_phone_edit").val();

  $.ajax({
    url : `http://127.0.0.1:3000/api/v1/people/${id}`,
    type : 'PUT',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded",
    data: {
      name: name,
      nickname: nickname,
      email: email,
      phone: phone
    },
  })
  .done(function(response){
    $("#editEmployeeModal").modal('hide');
    alert("Edição realizada com sucesso!");
    loadPeople();
  })
  .fail(function(error){
    alert("Ocorreu um erro inesperado");
  });
}

function loadModalFooterPersonDelete(id) {
  $("#modal-footer-delete").html(`<input type="button" class="btn btn-default" data-dismiss="modal" value="Cancelar">
  <input type="submit" class="btn btn-danger"
  onclick="event.preventDefault(); deletePerson(${id})" value="Remover" id="person_delete">`);
}

function deletePerson(id) {
  $.ajax({
    url : `http://127.0.0.1:3000/api/v1/people/${id}`,
    type : 'DELETE',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded",
  })
  .done(function(response){
    $("#deleteEmployeeModal").modal('hide');
    alert("Pessoa removida com sucesso!");
    loadPeople();
  })
  .fail(function(error){
    alert("Ocorreu um erro inesperado");
  });
}
