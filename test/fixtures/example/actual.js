// classtocss
import React from 'react'

import * as Style from './actual.ctc.css'

class T extends React.Component {

 	render() {
     return (
      <div classtocss className='ml30! mr30:a mt20 mb25 pl15 pr15 df aic bgcEEEEE7 br5'>
        <span className="bceee mt10 bw1 bbw2 btw5 br3 btlr3">hello world!</span>
        <span className="m10 mt-.20">dd</span>
      </div>
     )
    }
}

// React.createElement(List, {
//   classToCss: true,
//   className: "list m60 pa_i_h"
// }, React.createElement('style', {className: 'babel-style'}))