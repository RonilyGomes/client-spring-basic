const CREATED = 'CREATED';
const CONFLICT = 'CONFLICT';
const NOT_FOUND = 'NOT_FOUND';
const OK = 'OK';

$(document).ready(function(){
  loadNews();

  $("#news_save").click(function() {
    saveNews();
  });
});

function loadNews() {
  $.ajax({
    url : "http://127.0.0.1:8080/api/v1/news",
    type : 'get',
    dataType: 'json',
  })
  .done(function(response){
    console.log(response);
    $("#dataTable").html(generateRowsOfTable(response.data));
  })
  .fail(function(){
    alert("Ocorreu um erro inesperado!");
  });
}

function loadSingleNews(id) {
  $.ajax({
    // URL abaixo para testar noticia não encontrada
    //url : `http://127.0.0.1:8080/api/v1/news?id=500`,
    url : `http://127.0.0.1:8080/api/v1/news?id=${id}`,
    type : 'get',
    dataType: 'html',
  })
  .done(function(response){
    console.log(response);
    $("#editEmployeeModal").html(response);
  })
  .fail(function(xhr, ajaxOptions, thrownError){
    alert(extractErrorFromResponseHtml(xhr.responseText));
    $("#editEmployeeModal").modal("hide")
  });
}

function generateRowsOfTable(news) {
  result = '';

  $.each(news, function (i, n) {
    result += `<tr>
      <td>
        <span class="custom-checkbox">
          <input type="checkbox" id="checkbox1" name="options[]" value="1">
          <label for="checkbox1"></label>
        </span>
      </td>
      <td>${n.author}</td>
      <td>${n.title}</td>
      <td>${n.postDate}</td>
      <td>${n.content}</td>
      <td>
        <a href="#editEmployeeModal" class="edit" data-toggle="modal" onclick="loadSingleNews(${n.id})">
          <i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
        </a>
        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal" onclick="loadModalFooterSingleNewsDelete(${n.id})">
          <i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
        </a>
      </td>
    </tr>`
  });

  return result;
}

function saveNews() {
  let author    = $("#news_author").val();
  let title     = $("#news_title").val();
  let content   = $("#news_content").val();

  $.ajax({
    url : "http://127.0.0.1:8080/api/v1/news",
    type : 'POST',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded",
    data: {
      author: author,
      title: title,
      content: content
    },
  })
  .done(function(response){
    console.log(response);
    alert("cadastrado realizado com sucesso!");
    $("#addEmployeeModal").modal('hide');
    loadNews();
    clearFieldModalSave();
  })
  .fail(function(xhr, ajaxOptions, thrownError){
    alert(extractErrorFromResponse(xhr.responseText));
  });
}

function clearFieldModalSave() {
  $("#news_author").val("");
  $("#news_title").val("");
  $("#news_content").val("");  
}

function editSingleNews(id) {
  let title     = $("#news_title_edit").val();

  $.ajax({
    // URL abaixo para testar noticia não encontrada
    //url : `http://127.0.0.1:8080/api/v1/news/500/title/${title}`,
    url : `http://127.0.0.1:8080/api/v1/news/${id}/title/${title}`,
    type : 'PUT',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded"
  })
  .done(function(response){
    console.log(response);
    $("#editEmployeeModal").modal('hide');
    alert("Edição realizada com sucesso!");
    loadNews();
  })
  .fail(function(xhr, ajaxOptions, thrownError){
    alert(extractErrorFromResponse(xhr.responseText));
  });
}

function deleteSingleNews(id) {
  $.ajax({
    // URL abaixo para testar noticia não encontrada
    //url : `http://127.0.0.1:8080/api/v1/news/500`,
    url : `http://127.0.0.1:8080/api/v1/news/${id}`,
    type : 'DELETE',
    dataType: 'xml',
    contentType: "application/xml",
  })
  .done(function(response){
    console.log(response);
    $("#deleteEmployeeModal").modal('hide');
    alert("Notícia removida com sucesso!");
    loadNews();
  })
  .fail(function(xhr, ajaxOptions, thrownError){
    alert(extractErrorFromResponseXml(xhr.responseText));
  });
}

function loadModalFooterSingleNewsDelete(id) {
  $("#modal-footer-delete").html(`
    <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancelar">
    <input type="submit" class="btn btn-danger"
    onclick="event.preventDefault(); deleteSingleNews(${id})" value="Remover" id="news_delete">`
  );
}

function extractErrorFromResponse(response) {
  return eval("(" + response + ")").message;
}

function extractErrorFromResponseXml(response) {
  return $(response).find('message').text();
}

function extractErrorFromResponseHtml(response) {
  return $(response).text(); 
}