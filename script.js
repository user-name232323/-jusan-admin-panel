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

  // 👇 статус строка -> статус ID (обязательное требование сервера)
  function getStatusIdFromLabel(label) {
    const map = {
      "В работе": 1,
      "Нет тех возможности": 2
      // Добавь сюда другие статусы, если нужно
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
        body: JSON.stringify({ request_id: id, status_id }) // ✅ теперь request_id и status_id
      });

      const result = await response.json();
      if (result.success) {
        fetchRequests(); // перезагрузить список после обновления
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
            <button onclick="updateStatus(${request.id}, 'В работе')">Принять в работу</button>
            <button onclick="updateStatus(${request.id}, 'Нет тех возможности')">Отклонить</button>
          </div>
          <hr>
        `;
        list.appendChild(li);
      });
    } catch (err) {
      document.getElementById('requests-list').innerHTML = "<li>Ошибка загрузки</li>";
      console.error(err);
    }
  }

  if (localStorage.getItem("admin_logged_in") !== "true") {
    window.location.href = "index.html";
  } else {
    fetchRequests();
    setInterval(fetchRequests, 10000); // обновлять заявки каждые 10 сек
  }

  const avatar = document.querySelector(".user-avatar");
  if (avatar) {
    avatar.addEventListener("click", logout);
  }
}
