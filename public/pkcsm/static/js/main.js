const isRemember = $('#remember');
const btn_login = $('#btn_login');
btn_login.on('click', function() {
    console.log(isRemember.get(0).checked);
})

