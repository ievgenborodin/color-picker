var ColorPicker = window.ColorPicker || {};
ColorPicker.ui = (function($){
  var ui = function(){
    var picker, randomCols;    
      
    this.setValuesBlock = function(pickerContainer, picker, links){
      pickerContainer.on('mouseover touchstart touchmove', function(){
        var values = picker.getValues();
        links.h.html(values.h);
        links.s.html(values.s);
        links.v.html(values.v);
        links.r.html(values.r);
        links.g.html(values.g);
        links.b.html(values.b);
      });
    };
      
    this.setRandomBlock= function(pickerLink, randomView){
        var html = '', row;
        for(i=0;i<10;i++){
          row = '<div class="row"><div id="'+i+'" class="rand-col"></div>                <div class="hash"></div></div>';
          html+=row;
        }
        randomView.html(html); 
        $('.hash').addClass('col-xs-3 col-sm-2 col-md-2 col-lg-1');
        
        picker = pickerLink;
        randomCols = $('.rand-col');
        randomCols.addClass('col-xs-9 col-sm-8 col-md-6');
        this.updateRandoms();
    }
      
    this.updateRandoms = function(){
        var r, g, b, hex;
        for (var i=0;i<randomCols.length; i++){
            r = Math.floor(Math.random() * 255);
            g = Math.floor(Math.random() * 255);
            b = Math.floor(Math.random() * 255);
            hex = picker.getHex(r,g,b);
            randomCols.eq(i).css('background-color', '#'+hex).next('.hash').html('#'+hex);
        }
    };
            
  };
                  
  return ui;
})(jQuery);