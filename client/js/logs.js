window.onload = async () => {
   const config = JSON.parse(localStorage.getItem("droneConfig"));
 
   if (!config) {
     alert("Config not found. Please visit Page1 first.");
     return;
   }
 
   const droneId = config.drone_id;
 
   try {
     // ดึงข้อมูล log ของ drone ที่มี drone_id นี้จาก Server  http://localhost:8000/logs/${droneId}
     const response = await fetch(`https://drone-i8ji.onrender.com/logs/${droneId}`);
     const logs = await response.json();
 
     // จัดเรียง log ตามเวลา created ล่าสุดขึ้นก่อน
     logs.sort((a, b) => new Date(b.created) - new Date(a.created));
 
     // จำกัดแสดง 25 รายการล่าสุด
     const latestLogs = logs.slice(0, 25);
 
     // ดึง tbody ที่จะใส่ข้อมูล
     const logsTableBody = document.getElementById("logsTableBody");
 
     // เติมข้อมูลลงใน table
     latestLogs.forEach(log => {
       const row = document.createElement("tr");
 
       row.innerHTML = `
         <td>${new Date(log.created).toISOString()}</td>
         <td>${log.country}</td>
         <td>${log.drone_id}</td>
         <td>${log.drone_name}</td>
         <td>${log.celsius}</td>
       `;
 
       logsTableBody.appendChild(row);
     });
 
   } catch (err) {
     console.error("Error fetching logs:", err);
     document.getElementById("logsTableBody").innerHTML =
       "<tr><td colspan='5' class='text-center text-danger'>Error fetching logs. Please try again later.</td></tr>";
   }
 };
 