// ======== index.html ========
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // отключаем стандартную отправку формы

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
          <span class="request-id">#${request.id}</span>
          <span class="request-subject">${request.subject}</span> —
          <span class="request-desc">${request.description}</span>
        `;
        list.appendChild(li);
      });
    } catch (err) {
      document.getElementById('requests-list').innerHTML = "<li>Ошибка загрузки</li>";
      console.error(err);
    }
  }

  // Проверка авторизации и запуск цикла обновления
  if (localStorage.getItem("admin_logged_in") !== "true") {
    window.location.href = "index.html";
  } else {
    fetchRequests();
    setInterval(fetchRequests, 10000); // обновление каждые 10 секунд
  }

  // Привязка logout к аватарке (если нужно)
  const avatar = document.querySelector(".user-avatar");
  if (avatar) {
    avatar.addEventListener("click", logout);
  }
}
