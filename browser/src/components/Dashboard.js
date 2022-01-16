import { useState, useEffect} from "react";
import { Navigate} from "react-router-dom";

function Dashboard({ jwt, apiUrl }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/api/me`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${jwt}`
        }
      })
      if(response.status === 200)  {
        setUser(await response.json())
      }
    } 
    fetchData()
  }, [apiUrl, jwt]);

  return (
    jwt ? <>
      <main>
        <h1 className="title">Dashboard</h1>
        { user && user.vehicles.length > 0 ? <>
        <h2 className="subtitle">Vehicles</h2>
        <ul>
          { user.vehicles.map(vehicle => {
            return <li key={vehicle.id}>
              <div>
                <h3 className="subtitle">{vehicle.name}</h3>
                { vehicle.activated? 
                  <p>Activated</p> 
                : <div>
                  <p>
                    <strong>You need to build your IoT computer thing. </strong>
                    It's cool though. We have instructions...
                  </p>
                  <p>Head over to github to see what you need to do.</p>
                  <div className="notification">
                    <p><strong>Device Config Items</strong></p>
                    <p>
                      When setting up your device, you'll be asked to enter the following config items:
                    </p>
                    <div><label className="config-label">VAN_ID: </label> {vehicle.vehicleId}</div>
                    <div><label className="config-label">USER_ID: </label> {user.userId}</div>
                    <div><label className="config-label">API_URL: </label> {apiUrl}</div>
                  </div>
                </div>
                }
              </div>
            </li>
          })}
        </ul> 
        </>: 
        <>
        <p>Nice work... Let's get started, yeah?</p>
        <a href="/add-vehicle" className="button">Add a vehicle</a>
        </>
        }
      </main>

    </> : 
     <Navigate replace to='/login' />
  );
}

export default Dashboard;