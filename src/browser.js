(function () {
  var genRules = function(unit = 'px') {
    return [
      //display
      { reg: /^db($|_.*)/, to: 'display:block' },
      { reg: /^dib($|_.*)/, to: 'display:inline-block' },
      { reg: /^dn($|_.*)/, to: 'display:none' },

      // margin
      { reg: /^m(-?\d+)($|_.*)/, to: 'margin:$1' + unit },
      { reg: /^mt(-?\d+)($|_.*)/, to: 'margin-top:$1' + unit },
      { reg: /^mb(-?\d+)($|_.*)/, to: 'margin-bottom:$1' + unit },
      { reg: /^ml(-?\d+)($|_.*)/, to: 'margin-left:$1' + unit },
      { reg: /^mr(-?\d+)($|_.*)/, to: 'margin-right:$1' + unit },

      { reg: /^mra($|_.*)/, to: 'margin-right:auto' },
      { reg: /^mla($|_.*)/, to: 'margin-left:auto' },

      // padding
      { reg: /^p(-?\d+)($|_.*)/, to: 'padding:$1' + unit },
      { reg: /^pt(-?\d+)($|_.*)/, to: 'padding-top:$1' + unit },
      { reg: /^pb(-?\d+)($|_.*)/, to: 'padding-bottom:$1' + unit },
      { reg: /^pl(-?\d+)($|_.*)/, to: 'padding-left:$1' + unit },
      { reg: /^pr(-?\d+)($|_.*)/, to: 'padding-right:$1' + unit },

      { reg: /^pra($|_.*)/, to: 'padding-right:auto' },
      { reg: /^pla($|_.*)/, to: 'padding-left:auto' },

      // float
      { reg: /^fl($|_.*)/, to: 'float:left' },
      { reg: /^fr($|_.*)/, to: 'float:right' },
      { reg: /^ofh($|_.*)/, to: 'overflow:hidden' },
      { reg: /^ofa($|_.*)/, to: 'overflow:auto' },
      { reg: /^cb($|_.*)/, to: 'clear:both' },

      //text-align
      { reg: /^tal($|_.*)/, to: 'text-align:left' },
      { reg: /^tar($|_.*)/, to: 'text-align:right' },
      { reg: /^tac($|_.*)/, to: 'text-align:center' },

      // background
      { reg: /^bgn($|_.*)/, to: 'background:none' },
      { reg: /^bgc([0-9a-fA-F]{3,6})($|_.*)/, to: 'background-color:#$1' },

      // font
      { reg: /^lh(\d+)($|_.*)/, to: 'line-height:$1' + unit },
      { reg: /^fwb($|_.*)/, to: 'font-weight:bold' },
      { reg: /^fs(\d+)($|_.*)/, to: 'font-size:$1' + unit },
      { reg: /^c([0-9a-fA-F]{3,6})($|_.*)/, to: 'color:#$1' },
      { reg: /^tdn($|_.*)/, to: 'text-decoration:none' },
      { reg: /^tdu($|_.*)/, to: 'text-decoration:underline' },

      // position
      { reg: /^pa($|_.*)/, to: 'position:absolute' },
      { reg: /^pr($|_.*)/, to: 'position:relative' },
      { reg: /^pf($|_.*)/, to: 'position:fixed' },
      { reg: /^t(\d+)b($|_.*)/, to: 'top:$1%' },
      { reg: /^t(\d+)($|_.*)/, to: 'top:$1' + unit },
      { reg: /^b(\d+)($|_.*)/, to: 'bottom:$1' + unit },
      { reg: /^l(\d+)($|_.*)/, to: 'left:$1' + unit },
      { reg: /^r(\d+)($|_.*)/, to: 'right:$1' + unit },

      //width and height
      { reg: /^w(\d+)($|_.*)/, to: 'width:$1' + unit },
      { reg: /^w(\d+)b($|_.*)/, to: 'width:$1%' },
      { reg: /^miw(\d+)($|_.*)/, to: 'min-width:$1' + unit },
      { reg: /^h(\d+)($|_.*)/, to: 'height:$1' + unit },
      { reg: /^mih(\d+)($|_.*)/, to: 'min-height:$1' + unit },

      // border
      { reg: /^bw(\d+)($|_.*)/, to: 'border-width:$1' + unit },
      { reg: /^bbw(\d+)($|_.*)/, to: 'border-bottom-width:$1' + unit },
      { reg: /^blw(\d+)($|_.*)/, to: 'border-left-width:$1' + unit },
      { reg: /^brw(\d+)($|_.*)/, to: 'border-right-width:$1' + unit },
      { reg: /^btw(\d+)($|_.*)/, to: 'border-top-width:$1' + unit },
      { reg: /^bss($|_.*)/, to: 'border-style:solid' },
      { reg: /^bsd($|_.*)/, to: 'border-style:dashed' },
      { reg: /^bc(\w{3,6})($|_.*)/, to: 'border-color:#$1' },
      { reg: /^br(\d+)($|_.*)/, to: 'border-radius:$1' + unit },
      { reg: /^btlr(\d+)($|_.*)/, to: 'border-top-left-radius:$1' + unit },
      { reg: /^btrr(\d+)($|_.*)/, to: 'border-top-right-radius:$1' + unit },
      { reg: /^bbrr(\d+)($|_.*)/, to: 'border-bottom-right-radius:$1' + unit },
      { reg: /^bblr(\d+)($|_.*)/, to: 'border-bottom-left-radius:$1' + unit }
    ]
  }

  var rules = genRules();
  var classNameReg = /\s+class=['\"](.*?)['\"]/ig;

  var doTask = function(classNames) {
    var cssesObj = [];
    for (var className of classNames){
      var classArr = className.replace(classNameReg, '$1').split(' ').filter(s => s.length);
      for(var name of classArr){
          if (cssesObj[name]) continue
          var rule = rules.find(r => r.reg.test(name))
          if (!rule) continue
          cssesObj[name] = name.replace(rule.reg, rule.to);
          console.log('see:', name, rule, cssesObj[name])
      }
    }

    //创建style
    var styleNod = document.createElement('style');
    styleNod.type = 'text/css';
    var cssStr = Object.keys(cssesObj).map(key => {
        if (/_i(_|$)/.test(key)) return '.' + key + '{' + cssesObj[key] + ' !important}';
        if (/_h(_|$)/.test(key)) return  '.' + key + ':hover{' + cssesObj[key] + '}';
        return '.' + key + '{' + cssesObj[key] + '}'
    }).join('');

    if (!cssStr) return

    if(styleNod.styleSheet){
        styleNod.styleSheet.cssText = cssStr;  
    } else styleNod.innerHTML = cssStr;

    document.getElementsByTagName('head')[0].appendChild(styleNod); 
  }

  var run = function(config) {
    config = config || {};
    var htmlStr = config.html || (config.node || document.body).outerHTML;
    var taskStep = config.taskStep || 5000
    var classNames = htmlStr.match(classNameReg) || [];

    // 这块逻辑需要做分时处理
    var start = 0
    while(true) {
      var data = classNames.slice(start, start + taskStep);
      if (data.length <= 0) break;
      setTimeout(doTask.bind(null, data), 50)
      start = start + taskStep
    }
  }
  window.__sm_css = run
})()