document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const pass = document.getElementById('password').value;

  if (login && pass) {
    alert(`Вход выполнен для пользователя: ${login}`);
  } else {
    alert("Пожалуйста, заполните все поля");
  }
});
