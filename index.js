var Typer = {
    text: '',
    accessCountimer: null,
    index: 0,
    speed: 2,
    file: '',
    accessCount: 0,
    deniedCount: 0,
    init: function () {
      this.accessCountimer = setInterval(function () {
        Typer.updLstChr();
      }, 500);
      $.get(Typer.file, function (data) {
        Typer.text = data;
        Typer.text = Typer.text.slice(0, Typer.text.length - 1);
      });
    },
  
    content: function () {
      return $('#console').html();
    },
  
    write: function (str) {
      $('#console').append(str);
      return false;
    },
  
    processCommand: function(command) {
      switch (command.trim().toLowerCase()) {
        case 'help':
          Typer.write('<br/>Available commands:<br/>');
          Typer.write('1. <strong>help</strong> - Display this help message.<br/>');
          Typer.write('2. <strong>info</strong> - Show some information.<br/>');
          break;
        case 'info':
          Typer.write('<br/>This is a typing animation demo.<br/>');
          break;
        default:
          Typer.write('<br/>Unknown command. Type "help" for a list of commands.<br/>');
          break;
      }
    },
  
    addText: function (key) {
      if (key.keyCode == 18) {
        Typer.accessCount++;
        if (Typer.accessCount >= 3) {
          Typer.makeAccess();
        }
      } else if (key.keyCode == 20) {
        Typer.deniedCount++;
        if (Typer.deniedCount >= 3) {
          Typer.makeDenied();
        }
      } else if (key.keyCode == 27) {
        Typer.hidepop();
      } else if (Typer.text) {
        var cont = Typer.content();
        if (cont.substring(cont.length - 1, cont.length) == '|')
          $('#console').html(
            $('#console')
              .html()
              .substring(0, cont.length - 1),
          );
        if (key.keyCode != 8) {
          Typer.index += Typer.speed;
        } else {
          if (Typer.index > 0) Typer.index -= Typer.speed;
        }
        var text = Typer.text.substring(0, Typer.index);
        var rtn = new RegExp('\n', 'g');
        $('#console').html(text.replace(rtn, '<br/>'));
        window.scrollBy(0, 50);
        
        // Handle commands if there is no more text
        if (Typer.index >= Typer.text.length) {
          var fullText = Typer.content().replace('|', '');
          if (fullText.trim().toLowerCase().startsWith('> ')) {
            var command = fullText.substring(2);
            Typer.processCommand(command);
          }
        }
      }
  
      if (key.preventDefault && key.keyCode != 122) {
        key.preventDefault();
      }
  
      if (key.keyCode != 122) {
        key.returnValue = false;
      }
    },
  
    updLstChr: function () {
      var cont = this.content();
      if (cont.substring(cont.length - 1, cont.length) == '|')
        $('#console').html(
          $('#console')
            .html()
            .substring(0, cont.length - 1),
        );
      else this.write('|'); // else write it
    },
  };
  
  function replaceUrls(text) {
    var http = text.indexOf('http://');
    var space = text.indexOf('.me ', http);
    if (space != -1) {
      var url = text.slice(http, space - 1);
      return text.replace(url, '<a href="' + url + '">' + url + '</a>');
    } else {
      return text;
    }
  }
  
  Typer.speed = 3;
  Typer.file = 'Anonymo.html';
  Typer.init();
  
  var timer = setInterval(function() {
    t();
  }, 30);
  
  function t() {
    Typer.addText({ keyCode: 123748 });
    if (Typer.index > Typer.text.length) {
      clearInterval(timer);
    }
  }  
