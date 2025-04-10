window.onload = () => {
   // ดึงข้อมูล config ที่เก็บไว้ใน localStorage
   const config = JSON.parse(localStorage.getItem("droneConfig"));
 
   if (!config) {
     alert("Config not found. Please visit Page1 first.");
     return;
   }
 
   // ค่าที่จะถูกส่งไปที่ API
   const droneId = config.drone_id;
   const droneName = config.drone_name;
   const country = config.country;
 
   // ฟังก์ชันเมื่อ submit form
   document.getElementById("logForm").addEventListener("submit", async (e) => {
     e.preventDefault(); // ป้องกันการรีเฟรชหน้า
 
     const celsius = document.getElementById("temperature").value;
 
     // ตรวจสอบว่า celsius ถูกกรอกไว้หรือไม่
     if (!celsius) {
       document.getElementById("resultMessage").textContent = "Please enter a temperature value.";
       return;
     }
 
     // ส่งข้อมูลไปยัง API
     try {
       const response = await fetch("http://localhost:8000/logs", {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({
           celsius: parseFloat(celsius),
           country,
           drone_name: droneName,
           drone_id: droneId
         })
       });
 
       if (!response.ok) throw new Error("Failed to submit data.");
 
       const data = await response.json();
       document.getElementById("resultMessage").textContent = `Log created successfully: Drone ID: ${data.drone_id}, Temperature: ${data.celsius}°C`;
       document.getElementById("logForm").reset(); // เคลียร์ฟอร์ม
     } catch (err) {
       console.error("Error submitting log:", err);
       document.getElementById("resultMessage").textContent = "Error submitting log. Please try again later.";
     }
   });
 };
 