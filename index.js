var Typer = {
  text: '',
  accessCountimer: null,
  index: 0,
  speed: 2,
  file: '',
  accessCount: 0,
  deniedCount: 0,
  isTypingDone: false, // Flag to track if typing is done
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
    if (this.isTypingDone) {
      // If typing is done, handle command input
      if (key.keyCode === 13) { // Enter key
        var fullText = this.content().replace('|', '');
        if (fullText.trim().toLowerCase().startsWith('> ')) {
          var command = fullText.substring(2);
          this.processCommand(command);
        }
        $('#console').append('<br/>Anonymo@computer:~/> '); // Prompt for new command
        this.isTypingDone = false; // Reset flag for new typing
      }
      return;
    }

    if (key.keyCode == 18) {
      this.accessCount++;
      if (this.accessCount >= 3) {
        this.makeAccess();
      }
    } else if (key.keyCode == 20) {
      this.deniedCount++;
      if (this.deniedCount >= 3) {
        this.makeDenied();
      }
    } else if (key.keyCode == 27) {
      this.hidepop();
    } else if (this.text) {
      var cont = this.content();
      if (cont.substring(cont.length - 1, cont.length) == '|')
        $('#console').html(
          $('#console')
            .html()
            .substring(0, cont.length - 1),
        );
      if (key.keyCode != 8) {
        this.index += this.speed;
      } else {
        if (this.index > 0) this.index -= this.speed;
      }
      var text = this.text.substring(0, this.index);
      var rtn = new RegExp('\n', 'g');
      $('#console').html(text.replace(rtn, '<br/>'));
      window.scrollBy(0, 50);

      // Check if typing is done
      if (this.index >= this.text.length) {
        this.isTypingDone = true;
        $('#console').append('<br/>Anonymo@computer:~/> '); // Prompt for new command
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
