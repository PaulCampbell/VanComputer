import { useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";

import ErrorList from './ErrorList';

function AddVehicle({ jwt, apiUrl }) {
  const [vehicle, setVehicle] = useState({ name: '' })
  const [errors, setErrors] = useState([])
  let navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setVehicle(Object.assign({}, vehicle, {[e.target.name]: e.target.value}))
  }

  const addVehicle = async (e) => {
    const response = await fetch(`${apiUrl}/api/vehicles`, {
       method: 'POST',
       body: JSON.stringify(vehicle),
       headers: { 
         'content-type': 'application/json',
         'Authorization': `Bearer ${jwt}`
        }
    })
    if(response.status === 400) {
      const {details} = await response.json()
      setErrors(details)
    } else {
      setErrors([])
      navigate('/dashboard')
    }
  }

  return (
    jwt ? <>
      <main>
        <h2 className="title">Add your vehicle</h2>
        <ErrorList errors={errors} />
        <div className="field">
        <label className="label" htmlFor="name">Vehicle Name</label>
        <input className="input" onChange={handleChange} name="name"  id="name" type="text" placeholder="My Campervan" />
      </div>
      <button className="button" onClick={addVehicle}>Add Vehicle</button>
      </main>

    </> : 
     <Navigate replace to='/login' />
  );
}

export default AddVehicle;