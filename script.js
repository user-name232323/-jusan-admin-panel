document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  if (email && pass) {
    alert(`Вход выполнен для ${email}`);
    // Здесь можно сделать запрос на сервер
  } else {
    alert("Пожалуйста, заполните все поля");
  }
});
