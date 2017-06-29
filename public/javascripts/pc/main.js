//控制表单提交，放在判断外面
var count = 4
var options = {  
  url:'/submit',
  type:'POST',
  dataType: 'json',
  beforeSubmit: function(a,form,options){
    // console.log(a);
  },
  success: function(json){
      if (json.flag == 0) {
        console.log(json);
        // var tmp = $('#mytable tr.info td:first-child').text();
        $('#mytable').append("<tr class='info'><td>" + 
        (++count) + "</td><td>"+ 
        json.data.molecular +"</td><td>" +
        new Date() + "</td><td>"+ json.data.dataString + "</td></tr>");
        // 异步操作处理表格
      }else{
          alert(json.msg);
      }
  }, 
  error:function(data){
    alert('fail');
  }
};  

$('#myform').submit(function() {
    $(this).ajaxSubmit(options);
    // !!! Important !!!
    // always return false to prevent standard browser submit and page navigation
    return false;
});