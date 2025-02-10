import {MenuElement} from "../core/elements/Type.Element";

const DashboardPage = {
  layoutVisibility: true,
  render:  () => {
    const pageContainer = MenuElement("DashboardPage");
     fetchData().then((data)=>
     {

        pageContainer.elements[0].innerHTML = `
        <style>
          /* Dashboard stil tanımlamaları */
        </style>
        <div>
          <h1>Dashboard</h1>
          <p>Toplam Kullanıcı: ${data.total_users}</p>
          <p>Aktif Kullanıcı: ${data.active_users}</p>
          <p>Toplam Oyun: ${data.total_games}</p>
          <p>Devam Eden Oyun: ${data.ongoing_games}</p>
        </div>
      `
    
     }
    )







    
    return pageContainer.render();
  }
}

 async function fetchData() {
  // Django view'ından veriyi çek
  const response = await fetch('/dashboard/api/general/'); // API endpoint'i
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Hata kontrolü ekleyin
    }
  const data = await response.json();

  return data;
}


export default DashboardPage;