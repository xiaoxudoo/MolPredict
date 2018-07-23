//控制表单提交，放在判断外面

$('#myform1').submit(function (evt) {
  addprogress();
  return true;

});

$('#myform2 button').click(function (evt) {
  var type = $(this).data('type')
  $('#runtype').val(type)
})

$('#myform2 #myinput2').change(function (evt) {
  var type = $(this).data('type')
  $('#runtype').val(type)
})

$('#myform2').submit(function (evt) {

  var val = $(this).find('#myinput').val();
  var val2 = $(this).find('#myinput2').val();

  if (!val && !val2) {
      $("#errormsg").html("The molecules cannot be empty.");
      window.scrollTo(0,0);
      return false;
  } else {
      $("#errormsg").html('');
      addprogress();
      return true;
  }

});

$('#myform3').submit(function (evt) {

  var val = $(this).find('input[name="rsmi"]:checked').val();
  if (!val) {
      alert("please select an model");
      return false;
  } else {
      addprogress();
      return true;
  }

});

function addprogress() {
  $('.cal-mask').show();
  var wave = (function () {
      var ctx;
      var waveImage;
      var canvasWidth;
      var canvasHeight;
      var needAnimate = false;
      function init(callback) {
          var wave = document.getElementById('wave');
          var canvas = document.createElement('canvas');
          if (!canvas.getContext) return;
          ctx = canvas.getContext('2d');
          canvasWidth = wave.offsetWidth;
          canvasHeight = wave.offsetHeight;
          canvas.setAttribute('width', canvasWidth);
          canvas.setAttribute('height', canvasHeight);
          wave.appendChild(canvas);
          waveImage = new Image();
          waveImage.onload = function () {
              waveImage.onload = null;
              callback();
          }
          waveImage.src = '/pkcsm/static/img/wave.png';
      }
      function animate() {
          var waveX = 0;
          var waveY = 0;
          var waveX_min = -203;
          var waveY_max = canvasHeight * 0.7;
          var requestAnimationFrame =
              window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (callback) { window.setTimeout(callback, 1000 / 60); };
          function loop() {
              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              if (!needAnimate) return;
              if (waveY < waveY_max) waveY += 1.5;
              if (waveX < waveX_min) waveX = 0; else waveX -= 3;
              ctx.globalCompositeOperation = 'source-over';
              ctx.beginPath();
              ctx.arc(canvasWidth / 2, canvasHeight / 2, canvasHeight / 2, 0, Math.PI * 2, true);
              ctx.closePath();
              ctx.fill();
              ctx.globalCompositeOperation = 'source-in';
              ctx.drawImage(waveImage, waveX, canvasHeight - waveY);
              requestAnimationFrame(loop);
          }
          loop();
      }
      function start() {
          if (!ctx) return init(start);
          needAnimate = true;
          setTimeout(function () {
              if (needAnimate) animate();
          }, 500);
      }
      function stop() {
          needAnimate = false;
      }
      return { start: start, stop: stop };
  }());
  wave.start();
}


function onRadioClick(index) {
  console.log(index)
}