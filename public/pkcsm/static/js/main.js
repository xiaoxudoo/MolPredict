if (window.location.href.indexOf('signin') > -1) {
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

const deleteorder = function (id) {
    console.log(id);
    var r = window.confirm("Are you sure to delete this record?");
    if (r == true) {
        window.location.href = `/delete/${id}`
    }
}

const getQueryVal = function (name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r;
    //如果url有指定，那么从指定的地址中取值
    if (url && url.indexOf('?') != -1) {
        r = url.split('?')[1].match(reg);
    } else {
        //默认从当前页面地址中取值
        r = window.location.search.substr(1).match(reg);//r = ['匹配到的主串', $1, $2, $3, index, input]$1..9为正则表达式圆括号匹配的子串
    }
    if (r != null) return decodeURIComponent(r[2]);
    return '';
};

if (window.location.href.indexOf('reset_pass') > -1) {
    const key = getQueryVal('key');
    const email = getQueryVal('email');
    if (key && email) {
        $('#formEmail').val(email);
        $('#formKey').val(key);
    }
}
