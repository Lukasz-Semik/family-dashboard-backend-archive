const params = $.deparam(window.location.search);
const confirmButton = $('#btn-confirm');

$('#title-user-name').text(`Welcome ${params.userName}`);

confirmButton.on('click', () => {
  confirmButton.text('Sending confirmation');
  axios
    .post('api/user/confirm', {
      token: params.token,
    })
    .then(res => {
      if (res.status === 200) {
        return confirmButton.text('Confirmation sent');
      } else {
        return confirmButton.text('Something went wrong');
      }
    })
    .catch(err => confirmButton.text('Something went wrong'));
});
