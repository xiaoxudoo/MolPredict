if (window.location.href.indexOf('signin') > -1) {
    console.log('debug');
    let inputAccount = null;
    const loginObj = JSON.parse(window.localStorage.getItem('loginInfo'));
    if (loginObj) {
        $('#remember').get(0).checked = loginObj.isRemember;
        if (loginObj.isRemember) {
            $('#inputAccount').val(loginObj.username);
        }
    }
    document.getElementById('btn_login').addEventListener('click', function () {
        const inputAccount = $('#inputAccount').val();
        // const inputPassword = $('#inputPassword').val();
        const isRemember = $('#remember').get(0).checked;
        const loginObj = { 'isRemember': isRemember, 'username': inputAccount };

        window.localStorage.setItem('loginInfo', JSON.stringify(loginObj));
    }, false);
}
