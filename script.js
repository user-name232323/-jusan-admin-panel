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
        body: JSON.stringify({ name, password })
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

  function getStatusIdFromLabel(label) {
  const map = {
    "В работе": 2,
    "Нет тех возможности": 3,
    "Есть тех возможность": 4
  };
  return map[label] || null;
}

  // 👇 Показываем сообщение
  function showMessage(text) {
    let box = document.getElementById("message-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "message-box";
      Object.assign(box.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#4caf50",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        fontWeight: "600",
        userSelect: "none",
        zIndex: "1000",
        display: "none",
      });
      document.body.appendChild(box);
    }
    box.textContent = text;
    box.style.display = "block";
    setTimeout(() => {
      box.style.display = "none";
    }, 3000);
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
        body: JSON.stringify({ request_id: id, status_id })
      });

      const result = await response.json();
      if (result.success) {
        showMessage(`Заявка #${id} обновлена: ${statusLabel}`);
        fetchRequests();
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

      // Назначаем обработчики после рендера
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

  if (localStorage.getItem("admin_logged_in") !== "true") {
    window.location.href = "index.html";
  } else {
    fetchRequests();
    setInterval(fetchRequests, 10000);
  }

  const avatar = document.querySelector(".user-avatar");
  if (avatar) {
    avatar.addEventListener("click", logout);
  }
}
