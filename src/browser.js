(function () {
  var genRules = function(unit = 'px') {
    return [
      // margin
      { reg: /^m(\d+).*/, to: 'margin: $1' + unit },

      // font
      { reg: /^fs(\d+)$/, to: 'font-size: $1' + unit },

      // position
      { reg: /^pa$/, to: 'position: absolute' },
    ]
  }

  var rules = genRules();
  var classNameReg = /\s+class=['\"](.*?)['\"]/ig;

  var doTask = function(classNames) {
    var cssArr = [];
    for (var className of classNames){
      var classArr = className.replace(classNameReg, '$1').split(' ').filter(s => s.length);
      for(var name of classArr){
          if (cssArr[name]) continue
          var rule = rules.find(r => r.reg.test(name))
          if (!rule) continue
          cssArr[name] = name.replace(rule.reg, rule.to);
          console.log('see:', name, rule, cssArr[name])
      }
    }

    //创建style
    var styleNod = document.createElement('style');
    styleNod.type = 'text/css';
    var cssStr = Object.keys(cssArr).map(key => {
        if (/_i(_|$)/.test(key)) return '.' + key + '{' + cssArr[key] + ' !important}';
        if (/_h(_|$)/.test(key)) return  '.' + key + ':hover{' + cssArr[key] + '}';
        return '.' + key + '{' + cssArr[key] + '}'
    }).join('');

    if(styleNod.styleSheet){
        styleNod.styleSheet.cssText = cssStr;  
    } else styleNod.innerHTML = cssStr;

    document.getElementsByTagName('head')[0].appendChild(styleNod); 
  }

  var run = function(config) {
    config = config || {};
    var htmlStr = config.html || (config.node || document.body).outerHTML;
    var taskStep = config.taskStep || 5
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

/*

  var css_config = {};
  
  //a
  css_config['^ap([\\d]+)'] = '-moz-opacity:0.$1;-khtml-opacity: 0.$1;opacity: 0.$1';
  css_config['^ap([\\d]+)_e'] = 'filter:alpha(opacity=$1)';
  //b
  css_config['^bw([\\d-]+)'] = 'border-width:$1px';
  css_config['^bwb([\\d-]+)'] = 'border-bottom-width:$1px';
  css_config['^bwl([\\d-]+)'] = 'border-left-width:$1px';
  css_config['^bwr([\\d-]+)'] = 'border-right-width:$1px';
  css_config['^bwt([\\d-]+)'] = 'border-top-width:$1px';
  css_config['^bc(\\w{3,6})'] = 'border-color:#$1';
  css_config['^bss'] = 'border-style:solid';
  css_config['^bsd'] = 'border-style:dashed';
  
  // css_config['^bgi(\\w+)'] = 'background-image:url('+config.img_dir+'/$1.gif)';
  // css_config['^bgi(\\w+)_n'] = 'background:url('+config.img_dir+'/$1.gif) no-repeat';
  css_config['^bgc([0-9a-f]{3,6})'] = 'background-color:#$1';
  css_config['^bgn'] = 'background:none';
  //c
  css_config['^cb'] = 'clear:both';
  css_config['^cp'] = 'cursor:pointer';
  
  //display
  css_config['^db$'] = 'display:block';
  css_config['^dib$'] = 'display:inline-block';
  css_config['^dn$'] = 'display:none';
  //line
  css_config['^lh([\\d-]+)'] = 'line-height:$1px';
  //margin
  css_config['^m([\\d-]+)'] = 'margin:$1px';
  css_config['^mt([\\d-]+)'] = 'margin-top:$1px';
  css_config['^mb([\\d-]+)'] = 'margin-bottom:$1px';
  css_config['^mr([\\d-]+)'] = 'margin-right:$1px';
  css_config['^mra'] = 'margin-right:auto';
  css_config['^ml([\\d-]+)'] = 'margin-left:$1px';
  css_config['^mla'] = 'margin-left:auto';
  //float
  css_config['^fl'] = 'float:left';
  css_config['^fr'] = 'float:right';
  css_config['^ofh'] = 'overflow:hidden';
  css_config['^ofa'] = 'overflow:auto';
  
  //font
  css_config['^fwb'] = 'font-weight:bold';
  css_config['^fs(\\d+)'] = 'font-size:$1px';
  css_config['^c([0-9a-f]{3,6})'] = 'color:#$1';
  css_config['^tdn'] = 'text-decoration:none';
  css_config['^tdu'] = 'text-decoration:underline';
  css_config['^ffm'] = 'font-family: Microsoft Yahei';
  //padding
  css_config['^p([\\d-]+)'] = 'padding:$1px';
  css_config['^pt([\\d-]+)'] = 'padding-top:$1px';
  css_config['^pr([\\d-]+)'] = 'padding-right:$1px';
  css_config['^pb([\\d-]+)'] = 'padding-bottom:$1px';
  css_config['^pl([\\d-]+)'] = 'padding-left:$1px';
  css_config['^pra'] = 'padding-right:auto';
  css_config['^pla'] = 'padding-left:auto';
  
  css_config['^pf'] = 'position:fixed';
  
  //text-align
  css_config['^tal'] = 'text-align:left';
  css_config['^tar'] = 'text-align:right';
  css_config['^tac'] = 'text-align:center';
  //width and height
  css_config['^h([\\d-]+)'] = 'height:$1px';
  css_config['^h([\\d-]+)b'] = 'height:$1%';
  css_config['^w([\\d-]+)'] = 'width:$1px';
  css_config['^w([\\d-]+)b'] = 'width:$1%';
  css_config['^miw([\\d-]+)'] = 'min-width:$1px';
  //ul
  css_config['^lstn'] = 'list-style-type:none';
*/