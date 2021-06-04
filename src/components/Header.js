import React from 'react'

const header = ({title}) => {
    return (
        <header className = 'header'>
            <h1 style = {{textAlign:'center'}}>{title}</h1>
            <br />
            <p style = {{textAlign:'center'}}>Welcome to the triangle app! Below this text you see a box, you can draw in it with your mouse! Every time you calculate a triangle, the box will automatically generate a rough sketch of how the triangle type might look like. If you want to go back to your sketch, simply press on the drawing board again. </p>
            <br />
        </header>
    )
}


header.defaultProps = {
    title:'Triangle App'
}




export default header
