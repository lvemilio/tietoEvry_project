import React from 'react'

const header = ({title}) => {
    return (
        <header className = 'header'>
            <h1 style = {{textAlign:'center'}}>{title}</h1>
        </header>
    )
}


header.defaultProps = {
    title:'Triangle App'
}




export default header
