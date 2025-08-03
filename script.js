document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
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
        username: username,
        password: password
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("✅ Успешный вход!");
      localStorage.setItem("admin_logged_in", "true");
      window.location.href = "dashboard.html"; // <-- Замени на нужную страницу, если требуется
    } else {
      alert(result.message || "❌ Неверный логин или пароль");
    }

  } catch (error) {
    console.error("Ошибка:", error);
    alert("⚠️ Не удалось подключиться к серверу");
  }
});
