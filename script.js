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
      body: JSON.stringify({ name, password }) // 👈 строго name, а не username!
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
