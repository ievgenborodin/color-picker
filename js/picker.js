$(function(){
/* /////    VARIABLES    ///// */
var imageSV = $('#pickerBG'), //css, background-color #hashes
    cursorSV = $('#pointerBG'), //css, left 0-255, top 0-255
    imageH = $('#pickerColor'),
    cursorH = $('#pointerColor'), //css, top 0-255
    imageSVwidth = imageSV.width(),
    imageSVheight = imageSV.height(),
    imageHheight = imageH.height(),
    colorSpot = $('#colorSpot'), 
    colorHash = $('#colorHash'),
    result = imageSV.css('background-color'),
    th = $('#th'),
    ts = $('#ts'),
    tv = $('#tv'),
    tr = $('#tr'),
    tg = $('#tg'),
    tb = $('#tb'),
    locHue = {x: 0, y: 0}, 
    locSaVa ={x: imageSVwidth, y: 0}, 
    h = 360, s = 100, v =100, r=255, g=0, b=0, hex= 0xff0000;
    window.mousedown = 0;
    
    
/* ///////////       FUNCTIONS         ///////// */   
outData = function(H, S, V, R, G, B, Hex){
	h = H;   s = S;   v = V; 
    r = R;   g = G;   b = B; 
    hex = Hex;  
    switch (arguments.length){
        case 9:
            locSaVa.y = arguments[7];
            locSaVa.x = arguments[8];
            break;
        case 8:
            locHue.y = arguments[7];
    				imageSV.css('background-color', '#'+hsv2rgb(h,100,100).hex);
            break;
        case 10:
            locHue.y = arguments[7];
            locSaVa.y = arguments[8];
            locSaVa.x = arguments[9];
    				imageSV.css('background-color', '#'+hsv2rgb(h,100,100).hex);
            break;
    }
    
    th.html(h);
	ts.html(s);
    tv.html(v);
	tr.html(r);
	tg.html(g);
	tb.html(b);
	colorHash.val(hex);
    colorSpot.css('background-color', '#'+hex);
    cursorH.css({top: locHue.y+'px'});
    cursorSV.css('top', locSaVa.y + 'px').css('left', locSaVa.x + 'px');  
};    

/* ///   HSV - TO - RGB      //// */
hsv2rgb = function(h, s, v){
    var hh, X, C, r=0, g=0, b=0, m, hex;
	C = v / 100 * s / 100;
	hh = h / 60;
	X = C * (1 - Math.abs(hh % 2 - 1));
	if (hh >= 0 && hh < 1){
        r = C;	g = X;
	} else if (hh >= 1 && hh < 2) {
        r = X;	g = C;
    } else if (hh >= 2 && hh < 3) {
        g = C;	b = X;
	} else if (hh >= 3 && hh < 4) {
		g = X;  b = C;
	} else if (hh >= 4 && hh < 5) {
        r = X;	b = C;
	} else {
		r = C;	b = X;
	}
	m = (v / 100) - C;
    r = Math.floor((r + m) * 255); 
	g = Math.floor((g + m) * 255);
    b = Math.floor((b + m) * 255);
    hex = (r * 65536 + g * 256 + b).toString(16,6);
	if( hex.length < 6 )
	   for(i=0, l=6-hex.length; i<l; i++)
			hex = '0'+hex;
	return {
        r: r,
		g: g,
		b: b,
		hex: hex
	}
};

/*  /////     RGB - TO - HSV     /////  */    
rgb2hvs = function(r, g, b, hex){
    var h, s, v, m, M, c, hy, sy, vx;
    r /= 255;
	g /= 255;
	b /= 255;
	M = Math.max(r, g, b);
	m = Math.min(r, g, b);
	c = M - m;
	if (c == 0) h = 0;
	else if (M == r) 
        h = (((g - b) / c) % 6) * 60;
	else if (M == g) 
        h = ((b - r) / c + 2) * 60;
	else 
        h = ((r - g) / c + 4) * 60;
	if (h < 0) 
        h += 360;
	v = M * 100;
    s = (!M) ? 0 : (c / M * 100);
    return {
        h: h.toFixed(0),
        s: s.toFixed(0),
        v: v.toFixed(0),
        hy: imageHheight - Math.floor(imageHheight * h/360),
        sy: imageSVheight - Math.floor(imageSVheight * s/100),
        vx: Math.floor(imageSVwidth * v/100)
    }
};
rgb2hvs(255, 0, 0, 0xff0000);      

    
/*  BouncingClient  */
wtc = function(element, x, y) {
	var bbox = element[0].getBoundingClientRect();
	return { x: x - bbox.left * (element[0].width / bbox.width),
			y: y - bbox.top * (element[0].height / bbox.height)
	};
};

/*  Random Colors  */    
randomColors = function(){
    var r,g,b,hex, randCol = $('.rand-col');
    for (var i=0; i<10; i++){
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        hex = (r * 65536 + g * 256 + b).toString(16,6);
        if( hex.length < 6 )
	       for(j=0, l=6-hex.length; j<l; j++)
               hex = '0'+hex;
        $('#'+i).css('background-color', '#'+hex).next('.hash').html('#'+hex);    
    }
}   
randomColors();
    
/* ////////    EVENTS    ///////// */
$('#repeat').on('click', randomColors);    
    
    
/*  /////   DOWN     ////// */ 
imageH.on('touchstart', function(e) { 
 	e.preventDefault(e); 
    locHue = wtc(imageH,e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
 	downHue();
 });
 imageH.on('mousedown', function(e) { 	
 	e.preventDefault(e); 
 	locHue = wtc(imageH,e.clientX,e.clientY); 
    downHue();
 });
downHue = function(){
    h = Math.floor((imageHheight - locHue.y) / imageHheight * 360);
    h = (h < 0) ? 0 : (h>360) ? 360 : h;
    temp = hsv2rgb(h,s,v);
    outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locHue.y);
}

imageSV.on('touchstart', function(e) { 
 	e.preventDefault(e); 
    locSaVa = wtc(imageSV,e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
 	downSaVa();
 });
imageSV.on('mousedown', function(e) { 	
 	e.preventDefault(e); 
 	locSaVa = wtc(imageSV,e.clientX,e.clientY); 
    downSaVa();
 });
downSaVa = function(){
    s = Math.floor((imageSVheight - locSaVa.y) / imageSVheight * 100);
    v = Math.floor(locSaVa.x / imageSVwidth * 100);
    s = (s < 0) ? 0 : (s>100) ? 100 : s;
    v = (v < 0) ? 0 : (v>100) ? 100 : v;
	temp = hsv2rgb(h, s, v);
    outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locSaVa.y, locSaVa.x);
}



 /*  ///////   MOVE     /////// */ 
imageH.on('touchmove', function(e) { 
 	e.preventDefault(e); 
    locHue = wtc(imageH,e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
 	moveHue();
 });

$(window).on('mousedown mouseup', function(e) {
    this.mousedown = (e.type === 'mousedown') ? 1 : 0;
});    
    
imageH.on('mousemove', function(e) { 	
 	e.preventDefault(e); 
    locHue = (window.mousedown) ? wtc(imageH,e.clientX,e.clientY) : locHue; 
    moveHue();
 });
    
moveHue = function(){
    h = Math.floor((imageHheight - locHue.y) / imageHheight * 360);
    h = (h < 0) ? 0 : (h>=360) ? 359 : h;
    temp = hsv2rgb(h,s,v);
    outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locHue.y);
}

imageSV.on('touchmove', function(e) { 
 	e.preventDefault(e); 
    locSaVa = wtc(imageSV,e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY); 
 	moveSaVa();
 });
imageSV.on('mousemove', function(e) { 	
 	e.preventDefault(e);
    locSaVa = (window.mousedown) ? wtc(imageSV,e.clientX,e.clientY) : locSaVa;
    moveSaVa();
 });
moveSaVa = function(){
    s = Math.floor((imageSVheight - locSaVa.y) / imageSVheight * 100);
    v = Math.floor(locSaVa.x / imageSVwidth * 100);
    s = (s < 0) ? 0 : (s>100) ? 100 : s;
    v = (v < 0) ? 0 : (v>100) ? 100 : v;
	temp = hsv2rgb(h, s, v);
    outData(h, s, v, temp.r, temp.g, temp.b, temp.hex, locSaVa.y, locSaVa.x);
} 



/*  ////////   UP     /////// */ 
imageH.on('touchend', function(e) { 
 	e.preventDefault(e);
 	tmpLocHue = 0;
 });
    
imageSV.on('touchend', function(e) { 
 	e.preventDefault(e);
 	tmpLocSaVa = 0;
 });
    

/* ///////  colorHash on Blur   /////// */
colorHash.blur(function(){
    var hex = $(this).val(),
        tmp;
    switch (hex.length){
        case 6:
            r = parseInt(hex.substring(0,2), 16);
            g = parseInt(hex.substring(2,4), 16);
            b = parseInt(hex.substring(4,6), 16);
            tmp = rgb2hvs(r, g, b, hex);
            outData(tmp.h, tmp.s, tmp.v, r, g, b, hex, tmp.hy, tmp.sy, tmp.vx);
            break;
        case 3:
            r = parseInt(hex.substring(0,1), 16);
            g = parseInt(hex.substring(1,2), 16);
            b = parseInt(hex.substring(2,3), 16);
            tmp = rgb2hvs(r, g, b, hex);
            outData(tmp.h, tmp.s, tmp.v, r, g, b, hex, tmp.hy, tmp.sy, tmp.vx);
            break;
        default:
            alert("Please enter valid hex number of color!");
            break;
    }
});


});
