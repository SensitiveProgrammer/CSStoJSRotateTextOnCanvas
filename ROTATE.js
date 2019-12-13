// The runlauncher function will require some tinkering for your project and enviroment.

CanvasRenderingContext2D.prototype.broadPrint = function(text, x, y, lineHeight, maxWidth) {
  var lines = text.replace(/\s*$/,"").split("\n");
  var numberoflines = 0;
  for (var i = 0; i < lines.length; i++) {
    var words = lines[i].split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
      var testLine = '';
      if (words.length - 1 != n) {
        testLine = line + words[n] + ' ';
      } else {
        testLine = line + words[n] + '';
      }
      var metrics = this.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          numberoflines = numberoflines + 1;
          line = words[n] + ' ';
      }
      else {
          line = testLine;
      }
    }
    numberoflines = numberoflines + 1;
  }
  if (numberoflines > 1) {
    y = y - lineHeight*(0.5*(numberoflines-1));
  }
  for (var i = 0; i < lines.length; i++) {
    var words = lines[i].split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
      var testLine = '';
      if (words.length - 1 != n) {
        testLine = line + words[n] + ' ';
      } else {
        testLine = line + words[n] + '';
      }
      var metrics = this.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          this.fillText(line.replace(/\s*$/,""), x, y);
          line = words[n] + ' ';
          y += lineHeight;
      }
      else {
          line = testLine;
      }
    }
    this.fillText(line.replace(/\s*$/,""), x, y);
    y += lineHeight;
  }
}

function runlauncher(e) {
  var image = document.getElementById('image-upload');
  var imageheight = parseFloat(window.getComputedStyle(image, null).getPropertyValue('height')) * 3;
  var imagewidth = parseFloat(window.getComputedStyle(image, null).getPropertyValue('width')) * 3;
  var heightoffset = ((parseFloat(window.getComputedStyle(image, null).getPropertyValue('height')))/1686*100)/2000 + 0.826;
  var widthoffset =  ((parseFloat(window.getComputedStyle(image, null).getPropertyValue('width')))/951*100)/2000 + 0.826;
  var canvas = m.createElement('canvas', {'width':'951','height':'1686'});
  var precanvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var storytexteles = precanvas.querySelectorAll('#story-caption');
    var imagewrapper = document.getElementById('image-upload-wrapper');
    if (image != null) {
      var imagetop = parseFloat(window.getComputedStyle(image, null).getPropertyValue('margin-top')) * 3;
      var imageleft = Math.abs(parseFloat(window.getComputedStyle(imagewrapper, null).getPropertyValue('left'))) * 3;
      var img = new Image();
      img.src = image.src;
      img.onload = function () {
        var download = true; // false for data url
        var ctx_width = ctx.canvas.width;
        var ctx_height = ctx.canvas.height;
        var loaded_image_w = img.width;
        var loaded_image_h = img.height;
        var ratio = Math.min(ctx_width / loaded_image_w, ctx_height / loaded_image_h);
        var ratio_w = loaded_image_w * ratio;
        var ratio_h = loaded_image_h * ratio;
        var area = 1;
        if (ratio_w < ctx_width) area = ctx_width / ratio_w;                             
        if (Math.abs(area - 1) < 1e-14 && ratio_h < ctx_height) area = ctx_height / ratio_h;
        ratio_w = ratio_w * area;
        ratio_h = ratio_h * area;
        var source_width = loaded_image_w / (ratio_w / ctx_width);
        var source_height = loaded_image_h / (ratio_h / ctx_height);
        var source_x = imageleft / (imagewidth / loaded_image_w);
        if (source_width > loaded_image_w) source_width = loaded_image_w;
        if (source_height > loaded_image_h) source_height = loaded_image_h;
        ctx.drawImage(img, source_x, 0, source_width, source_height, 0, 0, ctx_width, ctx_height);
        [].forEach.call(storytexteles, function(storytext) {
            var storytextcontent = (storytext.innerText || storytext.textContent);
            var storytextparent = storytext.parentNode;
            var fontstyle = window.getComputedStyle(storytext, null).getPropertyValue('font-size');
            var textfontsize = parseFloat(fontstyle) * 3;
            var color = window.getComputedStyle(storytext, null).getPropertyValue('color');
            var eleleftcalc = parseInt(window.getComputedStyle(storytext.parentNode, null).getPropertyValue('left')) * 3;
            var eletopcalc = parseInt(window.getComputedStyle(storytext.parentNode, null).getPropertyValue('top')) * 3;
            browserwidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
            var rotation = Number(storytext.parentNode.style.transform.replace('rotate(', '').replace('deg)', '')); // check you have the right css value and element
            ctx.font = textfontsize + 'px Arial';
            ctx.fillStyle = color;
            var calcele = document.createElement(storytext.nodeName);
            calcele.setAttribute("style","margin:0px;padding:0px;font-family:"+storytext.style.fontFamily+";font-size:"+storytext.style.fontSize);
            calcele.innerHTML = "test";
            calcele = storytext.parentNode.appendChild(calcele);
            var calcheightpass = calcele.clientHeight * 3;
            var calcwidthpass = storytext.clientWidth * 3;
            calcele.parentNode.removeChild(calcele);
            var word1Width = ctx.measureText(storytextcontent).width * 3;
            var wordele1Width = parseInt(window.getComputedStyle(storytextparent, null).getPropertyValue('width')) * 3;
            var word1Height = parseInt(window.getComputedStyle(storytextparent, null).getPropertyValue('height')) * 3;
            var ro = rotation*Math.PI/180;
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.save();
            ctx.translate(eleleftcalc + wordele1Width * 0.5, eletopcalc + word1Height * 0.5);
            ctx.rotate(ro);
            ctx.broadPrint(storytextcontent, - 37, 0, calcheightpass, (storytext.getBoundingClientRect().width*3)-14.8);
            ctx.restore();
        });
        browserwidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
        if (download) { 
          canvas.toBlob(function(blob){
            var url = URL.createObjectURL(blob);
          }, 'image/jpeg', 1);
          console.log(url);
          return true;
        };
        var dataurl = canvas.toDataURL("image/jpeg");
        var filename = 'test' + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        var element = document.createElement('a');
        element.setAttribute('href', dataurl);
        element.setAttribute('download', filename);
        element.setAttribute('target', '_blank');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    }
  }
}

// code subject to license.txt
