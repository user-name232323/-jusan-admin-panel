// ======== index.html ========
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://jusik-servak-bd.onrender.com/admin_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, password }) // 👈 строго name, а не username
      });

      const result = await response.json();

      if (result.success === true) {
        localStorage.setItem("admin_logged_in", "true");
        window.location.href = "dashboard.html";
      } else {
        alert(result.message || "Ошибка авторизации");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      alert("Ошибка подключения к серверу");
    }
  });
}

// ======== dashboard.html ========
if (window.location.pathname.includes("dashboard.html")) {
  function logout() {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "index.html";
  } 

  // 👇 Статус строки -> ID статуса (подставь свои ID из БД)
  function getStatusIdFromLabel(label) {
    const map = {
      "В работе": 2,
      "Нет тех возможности": 3
      // Добавь сюда другие статусы по необходимости
    };
    return map[label] || null;
  }

  async function updateStatus(id, statusLabel) {
    const status_id = getStatusIdFromLabel(statusLabel);

    if (!status_id) {
      alert("Неизвестный статус: " + statusLabel);
      return;
    }

    try {
      const response = await fetch("https://jusik-servak-bd.onrender.com/update_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ request_id: id, status_id }) // ✅ request_id и status_id
      });

      const result = await response.json();
      if (result.success) {
        fetchRequests(); // Обновить список после изменения статуса
      } else {
        alert(result.message || "Ошибка при обновлении статуса");
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
      alert("Ошибка при обновлении статуса");
    }
  }

  async function fetchRequests() {
    try {
      const response = await fetch("https://jusik-servak-bd.onrender.com/requests");
      const data = await response.json();

      const list = document.getElementById('requests-list');
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<li>Нет заявок</li>";
        return;
      }

      data.forEach(request => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <strong>#${request.id}</strong> — ${request.subject}<br>
            <em>${request.description}</em><br>
            <span><b>Статус:</b> ${request.status}</span><br>
            <button class="btn-work" data-id="${request.id}">Принять в работу</button>
            <button class="btn-no-tech" data-id="${request.id}">Отклонить</button>
          </div>
          <hr>
        `;
        list.appendChild(li);
      });

      // Назначаем обработчики после рендера кнопок
      document.querySelectorAll(".btn-work").forEach(btn => {
        btn.onclick = () => updateStatus(btn.dataset.id, "В работе");
      });
      document.querySelectorAll(".btn-no-tech").forEach(btn => {
        btn.onclick = () => updateStatus(btn.dataset.id, "Нет тех возможности");
      });

    } catch (err) {
      document.getElementById('requests-list').innerHTML = "<li>Ошибка загрузки</li>";
      console.error(err);
    }
  }

  // Проверка авторизации
  if (localStorage.getItem("admin_logged_in") !== "true") {
    window.location.href = "index.html";
  } else {
    fetchRequests();
    setInterval(fetchRequests, 10000); // Автообновление каждые 10 сек
  }

  const avatar = document.querySelector(".user-avatar");
  if (avatar) {
    avatar.addEventListener("click", logout);
  }
}
