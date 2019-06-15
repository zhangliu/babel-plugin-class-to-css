import React from 'react'

class T extends React.Component {

  getPeople() {
    if (false) return (
      <div className="m70"></div>
    )
    return (
      <div className="m50">
        <div className="m60"></div>
      </div>
    )
  }

 	render() {
     return (
      <div className='m30'>
        <span className="m40">
          {this.getPeople()}
        </span>
        <style className="babel-style" />
      </div>
     )
    }
}