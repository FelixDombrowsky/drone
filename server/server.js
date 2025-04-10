import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();
const app = express();

const port = process.env.PORT ; 
const url_1 = process.env.URL_1;
const url_2 = process.env.URL_2; 

// Middleware
app.use(express.json());
app.use(cors())


// Route

app.get('/configs/:yourDroneId', async (req,res) => {
   try{
      const drone_id = parseInt(req.params.yourDroneId)
      const response = await axios.get(url_1)
      const data = response.data
      const drones = data.data
      const drone = drones.find(element => element.drone_id === drone_id)

      // Destructuring + Object Literal
      const drone_filter = (({drone_id, drone_name, light, country, weight})=> ({
         drone_id,
         drone_name,
         light,
         country,
         weight
      }))(drone);

      res.send(drone_filter)

   } catch(err){
      console.error(err.message);
      res.status(500).json({
         error: 'Internal Server Error',
         message: err.message
      })
   }
   
})

app.get('/status/:yourDroneId', async (req,res) => {
   try{
      const drone_id = parseInt(req.params.yourDroneId)
      const response = await axios.get(url_1)
      const data = response.data
      const drones = data.data
      const drone = drones.find(element => element.drone_id === drone_id)

      // Destructuring + Object Literal
      const drone_condition = (({condition})=> ({
         condition
      }))(drone);

      res.send(drone_condition)

   } catch(err){
      console.error(err.message);
      res.status(500).json({
         error: 'Internal Server Error',
         message: err.message
      })
   }
})

app.get('/logs/:yourDroneId', async (req,res) => {
   try{
      const drone_id = parseInt(req.params.yourDroneId)

      // String Concadinate & Query Pocketbase API
      // https://app-tracking.pockethost.io/api/collections/drone_logs/records?filter=(drone_id=65010789)&sort=-created&perPage=25
      const url_filter = `${url_2}?filter=drone_id=${drone_id}&sort=-created&perPage=25`
      
      const response = await axios.get(url_filter)
      const data = response.data
      const Drones = data.items
      const Drones_filter = Drones.map(item => ({
         drone_id: item.drone_id,
         drone_name: item.drone_name,
         created: item.created,
         country: item.country,
         celsius: item.celsius
      }))
      
      res.send(Drones_filter)
   }catch(err){
      console.error(err.message);
      res.status(500).json({
         error: 'Internal Server Error',
         message: err.message
      })
   }
  
})

app.post('/logs', async (req,res) => {
   try {
      const { celsius, country, drone_name, drone_id } = req.body
      const token = process.env.PB_ADMIN_TOKEN;
      const response = await axios.post(url_2 ,
         {
            celsius,
            country,
            drone_name,
            drone_id
         },
         {
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
         }
      )
      // Sent to client
      res.status(201).json({
         drone_id: response.data.drone_id,
         drone_name: response.data.drone_name,
         celsius: response.data.celsius,
         country: response.data.country,
         created: response.data.created
      })
   }catch(err){
      console.error(err.message);
      res.status(500).json({
         error: 'Internal Server Error',
         message: err.message
      })
   } 


})

// Endpoint Drone_ID
app.get('/env',(req,res) => {
   res.json({
      droneId: process.env.DRONE_ID
   })
})



// Port Listening
app.listen(port,() => {
   console.log(` Server is running on http://localhost:${port}`)
})

