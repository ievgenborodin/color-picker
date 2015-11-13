var ColorPicker = window.ColorPicker || {}; 
ColorPicker.Picker = (function($){
  var Picker = function(){  
      
    var areaH, areaSV, 
        pointerH, pointerSV,
        resultSpot, areaHex,
        maxHue, maxSaturation, maxValue,
        h = 360,  s = 100, v = 100, 
        r = 255,  g = 0,   b = 0,
        hex = 0xff0000,
        locH = { x:0, y:0 },
        locSV = { x:0, y:0 };
          
      
    this.init = function(AreaH, PointerH, AreaSV, PointerSV, ResultSpot, AreaHex){
        areaH = AreaH;
        areaSV = AreaSV;
        pointerH = PointerH;
        pointerSV = PointerSV;
        resultSpot = ResultSpot || 0;
        areaHex = AreaHex;
        maxHue = areaH.height();
        maxSaturation = areaSV.height();
        locSV.x = maxValue = areaSV.width();
        areaSV.css('background-color');
        setEvents();
    };
      
    this.getValues = function(){
      return{
        h: h, 
        s: s, 
        v: v, 
        r: r,  
        g: g, 
        b: b,
        hex: hex
      };
    };
      
    this.getHex= function(r,g,b){
        return setHex(r,g,b);
    };     
      
    this.getHSV= function(r,g,b){
        return setHSV(r,g,b);
    };    
      
    this.getRGB= function(h,s,v){
        return setRGB(h,s,v);
    };      
      
    var setEvents = function(){
        $(window).on('mousedown mouseup', function(e) {
            this.mousedown = (e.type === 'mousedown') ? 1 : 0;
        });  
        areaHex.blur(hexOnBlur);
        setArea(areaH, locH, eventOnHue);
        setArea(areaSV, locSV, eventOnSaturationValue);
    },  
      
    setArea = function(element, loc, callback){
      element.on('touchstart touchmove mousedown mousemove', function(e) { 
 	      e.preventDefault(e);  
          switch (e.type){
            case 'mousedown':
              loc = getBoundingBox(element,e.clientX,e.clientY)    
            case 'mousemove':
              loc = (window.mousedown) ? getBoundingBox(element,e.clientX,e.clientY) : loc;
              break;
            default:
              var windowScroll = $(window).scrollTop();
              loc = getBoundingBox(element, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY - windowScroll);
          }
          callback(loc);
      });
    },
            
    setRGB = function(h, s, v){
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
        return {
            r: r,
            g: g,
            b: b,
        }
    },   
        
    setHex= function(r,g,b){
        var hex = (r * 65536 + g * 256 + b).toString(16,6);
        if( hex.length < 6 )
           for(i=0, l=6-hex.length; i<l; i++)
                hex = '0'+hex;
        return hex;
    },  
     
    setHSV= function(r, g, b){
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
            v: v.toFixed(0)
        }
    },

    getHue= function(maxHue, loc){
        var h = Math.floor((maxHue - loc.y) / maxHue * 360);
        h = (h < 0) ? 0 : (h>360) ? 360 : h;
        return h;
    },
      
    getSaturation= function(maxSaturation, loc){
        var s = Math.floor((maxSaturation - loc.y) / maxSaturation * 100);
        s = (s < 0) ? 0 : (s>100) ? 100 : s;
        return s;
    },
  
    getValue= function(maxValue, loc){
        var v = Math.floor(loc.x / maxValue * 100);
        v = (v < 0) ? 0 : (v>100) ? 100 : v;
        return v;
    },
  
    hexOnBlur= function(){
        var newHex = areaHex.val(), 
            hexLength = newHex.length,
            tmp, m;
        if(hexLength === 3 || hexLength === 6){
            m = (hexLength % 6 == 0) ? 2 : 1;
            r = parseInt(newHex.substring(0, m*1), 16);
            g = parseInt(newHex.substring(m*1,m*2), 16);
            b = parseInt(newHex.substring(m*2,m*3), 16);
            tmp = setHSV(r, g, b);
            h = tmp.h;
            s = tmp.s;
            v = tmp.v;
            hex = setHex(r, g, b);
            changeBackground(h);          
            moveHuePointer();
            moveSaturationValuePointer();
            resultSpot.css('background-color', '#'+newHex);
            moveBackPointers(); 
//            console.log('h:'+locH.y+', s:'+locSV.y+', v:'+locSV.x);
        } else 
            alert("Please enter valid hex number of color!");
    },   
        
    changeBackground= function(h){
        var tmpHex, 
            tmp = setRGB(h, 100, 100);
        tmpHex = setHex(tmp.r, tmp.g, tmp.b);
        areaSV.css('background-color', '#'+tmpHex);
    },  
      
    moveHuePointer = function(){
        var posHue = maxHue - Math.floor(maxHue * h/360);    
        pointerH.css({top: posHue+'px'});  
    },
        
    moveBackPointers = function(){
        locH.y = maxHue - (h / 360) * maxHue;
        locSV.y = maxSaturation - (s / 100) * maxSaturation;
        locSV.x = (v / 100) * maxValue;
    },    

    getResult = function(){
        resultSpot.css('background-color', '#'+hex);
        areaHex.val(hex);
    },        
        
    moveSaturationValuePointer = function(){
        var posValue = Math.floor(maxValue * v/100),
            posSaturation = maxSaturation - Math.floor(maxSaturation * s/100);    
        pointerSV.css('top', posSaturation + 'px')
                .css('left', posValue + 'px');  
    },
      
    getBoundingBox= function(element, x, y) {
        var bbox = element[0].getBoundingClientRect();
        return { x: x - bbox.left * (element[0].width / bbox.width),
                y: y - bbox.top * (element[0].height / bbox.height)
        };
    },  
          
    eventOnHue= function(loc){
        h = getHue(maxHue, loc);
        changeBackground(h);
        moveHuePointer();
        reCountRGBHex();
    },

    eventOnSaturationValue= function(loc){
        s = getSaturation(maxSaturation, loc);
        v = getValue(maxValue, loc);
        moveSaturationValuePointer();
        reCountRGBHex();
    },
      
    reCountRGBHex= function(){
        var temp = setRGB(h, s, v);
        r = temp.r;
        g = temp.g;
        b = temp.b;
        hex = setHex(r, g, b);
        getResult();
    };  
  };
  return Picker;
})(jQuery);