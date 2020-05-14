
$('document').ready(() => {
  let teams;
  $.get('/teams', (data, status) => {
    if(status == 'success'){
      teams = JSON.parse(data);
    }else{
      console.log('error!!!');
    }
  });

  $('#teamName').on('input', (event) => {
    let present = teams.includes($('#teamName').val())
    if(present){
      $('#teamName').addClass('invalid');
      $('#nextBtn').hide();
      $('#message').append('Team name already exists');
    }
  });
});