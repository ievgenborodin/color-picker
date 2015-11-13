Modernizr.load([{
    load: "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"
    ,complete: function(){
      if (!window.jQuery)
        Modernizr.load('js/lib/jquery.js');
    }
  }
  ,'js/src/picker.js'
  ,{
    load: 'js/src/ui.js',
    complete: function(){
    
        var picker = new ColorPicker.Picker(),
            ui = new ColorPicker.ui(),
            
          /* picker block */
          areaH = $('#pickerColor'),
          pointerH = $('#pointerColor'),
          areaSV = $('#pickerBG'),
          pointerSV = $('#pointerBG'),
          resultSpot = $('#colorSpot'),
          areaHex = $('#colorHash'),
          
          /* numbers block */
          pickerContainer = $('#divPicker'),
          links = {
            h: $('#th'),
            s: $('#ts'),
            v: $('#tv'),
            r: $('#tr'),
            g: $('#tg'),
            b: $('#tb'),
          };
            
          /* random block */      
          viewRandom = $('#viewRandom');
        
      picker.init(areaH, pointerH, areaSV, pointerSV, resultSpot, areaHex);
      ui.setValuesBlock(pickerContainer, picker, links);
      ui.setRandomBlock(picker, viewRandom);
      $('#btnOk').attr('disabled', 'disabled');
      $('#repeat').on('click', ui.updateRandoms); 
    }
  }
  ]);