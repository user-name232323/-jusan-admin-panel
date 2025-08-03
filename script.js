document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Отключаем стандартное поведение формы

  const username = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://jusik-servak-bd.onrender.com/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success === true) {
      // Сохраняем в localStorage метку авторизации
      localStorage.setItem("admin_logged_in", "true");
      // Переход в админ-панель
      window.location.href = "dashboard.html";
    } else {
      alert("Неверный логин или пароль");
    }
  } catch (error) {
    console.error("Ошибка входа:", error);
    alert("Не удалось подключиться к серверу");
  }
});
