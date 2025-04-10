async function getDroneConfigFromEnv() {
   try {
      // Get DRONE_ID from Server (.env)
      const envRes = await fetch('http://localhost:8000/env');
      const envData = await envRes.json() 
      const droneID = envData.droneId;
      console.log(droneID)

      // API Config Drone
      const configRes = await fetch(`http://localhost:8000/configs/${droneID}`)
      const config = await configRes.json();
      console.log(config)

      // Visualize
      document.getElementById("droneId").textContent = config.drone_id;
      document.getElementById("droneName").textContent = config.drone_name;
      document.getElementById("light").textContent = config.light;
      document.getElementById("country").textContent = config.country;

      // Collect data in local storage
      localStorage.setItem("droneConfig", JSON.stringify(config));

   } catch (err) {
      console.error("Error:", err);
      document.getElementById("config-box").innerHTML = '<p class="text-danger">⚠️ เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
   }
}
// getDroneConfigFromEnv()

window.onload = getDroneConfigFromEnv;


