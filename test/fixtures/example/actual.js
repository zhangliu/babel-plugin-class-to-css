import React from 'react'
const Style = {}

class T extends React.Component {

  getPeople() {
    return (
      <div id='3'>
        <div id='4'></div>
      </div>
    )
  }

 	render() {
     return (
      <div id='1' className='fs12 pa m20'>
        <style dangerouslySetInnerHTML={{ __html: Style }} />
        <style className="babel-style" dangerouslySetInnerHTML={{ __html: {} }} />
        <span id='2'>
          {this.getPeople()}
        </span>
      </div>
     )
    }
}