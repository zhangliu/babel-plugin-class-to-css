// classtocss
import React from 'react'

import * as Style from './actual.ctc.css'

class T extends React.Component {

 	render() {
     return (
      <div classtocss className='container mt30 m4.50 bgi-process-png ls2'>
        <span className="bceee mt10 bw1 bbw2 btw5 br3 btlr3">hello world!</span>
        <span className="m10 mt20">dd</span>
      </div>
     )
    }
}

// React.createElement(List, {
//   classToCss: true,
//   className: "list m60 pa_i_h"
// }, React.createElement('style', {className: 'babel-style'}))