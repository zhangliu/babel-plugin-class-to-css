import React, {Fragment} from 'react'

class T extends React.Component {

  getPeople() {
    const isShow = Math.random() * 10 > 5
    if (isShow) return <div className="m10"></div>
    return (
      <div className="m20">
        <div className="m30"></div>
      </div>
    )
  }

 	render() {
     const isShow = Math.random() * 10 > 5
     return (
      <div classtocss className='container m40'>
        <Header className='header m50 h50'/>
        <span className="body m60 h60">hello world!</span>
        { isShow ? this.getPeople() : null}
      </div>
     )
    }
}

// React.createElement(List, {
//   classToCss: true,
//   className: "list m60 pa_i_h"
// }, React.createElement('style', {className: 'babel-style'}))