const backgroundImg = require('./converts/backgroundImg')

const genRules = (unit = 'px') => {
  return [
    // display
    { reg: /^db($|_.*)/, to: 'display:block' },
    { reg: /^dib($|_.*)/, to: 'display:inline-block' },
    { reg: /^dn($|_.*)/, to: 'display:none' },
    { reg: /^df($|_.*)/, to: 'display:flex' },

    // flex
    { reg: /^fdc($|_.*)/, to: 'flex-direction:column' },
    { reg: /^aic($|_.*)/, to: 'align-items:center' },
    { reg: /^jcc($|_.*)/, to: 'justify-content:center' },
    { reg: /^dif($|_.*)/, to: 'display:inline-flex' },
    { reg: /^jcsb($|_.*)/, to: 'justify-content:space-between' },
    { reg: /^jcsa($|_.*)/, to: 'justify-content:space-around' },
    { reg: /^jcfe($|_.*)/, to: 'justify-content:flex-end' },
    { reg: /^asfe($|_.*)/, to: 'align-self:flex-end' },

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
    { reg: /^ofys($|_.*)/, to: 'overflow-y: scroll' },

    //text-align
    { reg: /^tal($|_.*)/, to: 'text-align:left' },
    { reg: /^tar($|_.*)/, to: 'text-align:right' },
    { reg: /^tac($|_.*)/, to: 'text-align:center' },
    { reg: /^tdlt($|_.*)/, to: 'text-decoration:line-through' },

    // background
    { reg: /^bgn($|_.*)/, to: 'background:none' },
    { reg: /^bgi-([_0-9a-zA-Z]+)(-([0-9a-zA-Z]+))?($|_.*)/, func: backgroundImg },
    { reg: /^bgc([0-9a-fA-F]{3,8})($|_.*)/, to: 'background-color:#$1' },
    { reg: /^bilg-(\d+)-(\w{3,8})-(\w{3,8})($|_.*)/, to: 'background-image:linear-gradient($1deg, #$2, #$3)'},

    // font
    { reg: /^lh(\d+)($|_.*)/, to: 'line-height:$1' + unit },
    { reg: /^fwb($|_.*)/, to: 'font-weight:bold' },
    { reg: /^fs(\d+)($|_.*)/, to: 'font-size:$1' + unit },
    { reg: /^c([0-9a-fA-F]{3,8})($|_.*)/, to: 'color:#$1' },
    { reg: /^tdn($|_.*)/, to: 'text-decoration:none' },
    { reg: /^tdu($|_.*)/, to: 'text-decoration:underline' },
    { reg: /^toe($|_.*)/, to: 'text-overflow:ellipsis' },
    { reg: /^wsn($|_.*)/, to: 'white-space:nowrap' },
    { reg: /^ls(-?\\d+)($|_.*)/, to: 'letter-spacing: $1' },
    { reg: /^wwbw($|_.*)/, to: 'word-wrap:break-word' },
    { reg: /^wbba($|_.*)/, to: 'word-break:break-all' },

    // position
    { reg: /^pa($|_.*)/, to: 'position:absolute' },
    { reg: /^pr($|_.*)/, to: 'position:relative' },
    { reg: /^pf($|_.*)/, to: 'position:fixed' },
    { reg: /^t(\d+)b($|_.*)/, to: 'top:$1%' },
    { reg: /^t(-?\d+)($|_.*)/, to: 'top:$1' + unit },
    { reg: /^b(-?\d+)($|_.*)/, to: 'bottom:$1' + unit },
    { reg: /^l(-?\d+)($|_.*)/, to: 'left:$1' + unit },
    { reg: /^r(-?\d+)($|_.*)/, to: 'right:$1' + unit },

    //width and height
    { reg: /^w(\d+)($|_.*)/, to: 'width:$1' + unit },
    { reg: /^w(\d+)b($|_.*)/, to: 'width:$1%' },
    { reg: /^miw(\d+)($|_.*)/, to: 'min-width:$1' + unit },
    { reg: /^maw(\d+)($|_.*)/, to: 'max-width:$1' + unit },

    { reg: /^h(\d+)($|_.*)/, to: 'height:$1' + unit },
    { reg: /^h(\d+)b($|_.*)/, to: 'height:$1%' },
    { reg: /^mih(\d+)($|_.*)/, to: 'min-height:$1' + unit },
    { reg: /^mah(\d+)($|_.*)/, to: 'max-height:$1' + unit },

    // border
    { reg: /^bw(\d+)($|_.*)/, to: 'border-width:$1' + unit },
    { reg: /^bbw(\d+)($|_.*)/, to: 'border-bottom-width:$1' + unit },
    { reg: /^blw(\d+)($|_.*)/, to: 'border-left-width:$1' + unit },
    { reg: /^brw(\d+)($|_.*)/, to: 'border-right-width:$1' + unit },
    { reg: /^btw(\d+)($|_.*)/, to: 'border-top-width:$1' + unit },
    { reg: /^bss($|_.*)/, to: 'border-style:solid' },
    { reg: /^bsd($|_.*)/, to: 'border-style:dashed' },
    { reg: /^bc(\w{3,8})($|_.*)/, to: 'border-color:#$1' },
    { reg: /^br(\d+)($|_.*)/, to: 'border-radius:$1' + unit },
    { reg: /^btlr(\d+)($|_.*)/, to: 'border-top-left-radius:$1' + unit },
    { reg: /^btrr(\d+)($|_.*)/, to: 'border-top-right-radius:$1' + unit },
    { reg: /^bbrr(\d+)($|_.*)/, to: 'border-bottom-right-radius:$1' + unit },
    { reg: /^bblr(\d+)($|_.*)/, to: 'border-bottom-left-radius:$1' + unit },

    // transform
    { reg: /^tr(\\d+)($|_.*)/, to: 'transform:rotate($1deg)' },

    // 背景
    { reg: /^bgsct$/, to: 'background-size: contain'},
    { reg: /^bgscv$/, to: 'background-size: cover'},

    // 透明
    { reg: /^o(\d+)($|_.*)/, to: 'opacity:.$1' },
    { reg: /^zi(-?\d+)($|_.*)/, to: 'z-index:$1' },
  ]
}

module.exports = {
  genRules
}