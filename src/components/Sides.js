import React,{useRef, Component } from 'react' 
import equilateral_tr from './equilateral_tr.jpg'
import isosceles_tr from './isosceles_tr.jpg'
import scalene_tr from './scalene_tr.jpg'

class Sides extends Component{

  //Constructor setting up the Sides form and its state
  constructor(props){ 
    super(props)
    this.state = { Side1:'',Side2:'', Side3:'', isSubmitted:false}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  // HandleSubmit is triggered every time user clicks the 'Calculate triangle' button, prevents default values and null values with error. 
  handleSubmit(event){
    const { Side1, Side2, Side3 } = this.state
    event.preventDefault()
    if(Side1 === '' || Side2 === '' || Side3 === ''){
        alert("Please specify all triangle sides.") 
    }
    else{
         this.getTriangleType();
         this.setState({ isSubmitted: true });
         console.log(this.state.isSubmitted) 
    }
     
  }
  //HandleChange is called every time the user changed any of the input fields, since it is assumed
  //that every time the user changes an input, they want to recalculate the triangle, so the isSubmitted state is changed.
  //Function also prevents invalid values
  handleChange(event){
    const re = /^[1-9]\d*$/;
          if (event.target.value === '' || re.test(event.target.value)) {
             this.setState({[event.target.name] : event.target.value})
          }
        this.setState({ isSubmitted: false });
  }
  //Object that stores triangle types
  TRIANGLE_TYPES = Object.freeze({
    ISOSCELES: "ISOSCELES",
    SCALENE: "SCALENE",
    EQUILATERAL: "EQUILATERAL",
    IMPOSSIBLE: "IMPOSSIBLE"
})

  //Function to calculate what type of triangle was created 
  getTriangleType = () => {
    const uniqueSides = [...new Set([this.state.Side1, this.state.Side2, this.state.Side3])]
    const side1 = parseInt(this.state.Side1,10);
    const side2 = parseInt(this.state.Side2,10);
    const side3 = parseInt(this.state.Side3,10);
    if(this.state.Side1 != '' || this.state.Side2 != '' || this.state.Side3 != ''){
        if(side1+side2<=side3 || side2+side3<=side1 || side1+side3<=side2){
            return this.TRIANGLE_TYPES.IMPOSSIBLE
        }
        else if (uniqueSides.length === 3) {
            return this.TRIANGLE_TYPES.SCALENE;
        }
        else if (uniqueSides.length === 2) {
            console.log(this.state.Side1)
            return this.TRIANGLE_TYPES.ISOSCELES;
        }    
        else {
        return this.TRIANGLE_TYPES.EQUILATERAL;
        }
    }
}

  //Output string is dependant on the triangle type, called every time user presses calculate
  getOutputString = () => {
    const triangleType = this.getTriangleType();
    const prefix = "This triangle is "
    if (triangleType === this.TRIANGLE_TYPES.IMPOSSIBLE){
        return "Is not possible to calculate this kind of triangle. Please check your input values, note that the sum of any two lengths should not be equal to or smaller than the 3rd length."
    }
    else if (triangleType === this.TRIANGLE_TYPES.EQUILATERAL) {
        return prefix + "equilateral.";
    }
    else if (triangleType === this.TRIANGLE_TYPES.ISOSCELES) {
        return prefix + "isosceles.";
    }
    else {
        return prefix + "scalene."
    }
}



  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        {this.getTriangleType() === this.TRIANGLE_TYPES.EQUILATERAL && this.state.isSubmitted && 
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <img src = {equilateral_tr}  alt = '' height = '200' width = '200'></img>    
                        </div>}
        {this.getTriangleType() === this.TRIANGLE_TYPES.ISOSCELES && this.state.isSubmitted && 
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <img src = {isosceles_tr} alt = '' height = '200' width = '200'></img>    
                        </div>}
        {this.getTriangleType() === this.TRIANGLE_TYPES.SCALENE && this.state.isSubmitted && 
                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                        <img src = {scalene_tr} alt = '' height = '200' width = '200'></img>    
                        </div>}                
        {this.state.isSubmitted &&
                        <div data-ts="Note">
                            <p id = "triangle_type" style = {{textAlign:'center'}}><b>{this.getOutputString()}</b></p>
                        </div>
                    }
        <div className = 'form-control'>
          <label htmlFor='Side1'>A side</label>
          <input 
            name='Side1'
            placeholder='A side' 
            value = {this.state.Side1}
            onChange={this.handleChange}
          />
        </div>
        <div className = 'form-control'>
          <label htmlFor='Side2'>B side</label>
          <input
            name='Side2' 
            placeholder='B side'
            value={this.state.Side2}
            onChange={this.handleChange}
          />
        </div>
        <div className = 'form-control'>
          <label htmlFor='Side3'>C side</label>
          <input
            name='Side3' 
            placeholder='C side'
            value={this.state.Side3}
            onChange={this.handleChange}
            
          />
        </div>
        <div>
            <input type = 'submit' value = 'Calculate triangle' className='btn btn-block'/>
        </div>
      </form>
    )
  }
}
  
export default Sides