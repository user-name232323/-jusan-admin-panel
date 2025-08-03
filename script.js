document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !password) {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  try {
    const response = await fetch("https://jusik-servak-bd.onrender.com/admin_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name, // заменено с username на name
        password: password
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("✅ Успешный вход!");
      localStorage.setItem("admin_logged_in", "true");
      window.location.href = "dashboard.html";
    } else {
      alert(result.message || "❌ Неверный логин или пароль");
    }

  } catch (error) {
    console.error("Ошибка:", error);
    alert("⚠️ Не удалось подключиться к серверу");
  }
});
