const themeMap = {
  dark: "light",
  light: "dark"
};
var rememberUser;
var storageLocation = sessionStorage;

function registerMe() {
  const emailErrorSpan = document.getElementById("register-email-error");
  const passwordErrorSpan = document.getElementById("register-password-error");
  const passwordConfirmErrorSpan = document.getElementById("register-password-confirm-error");
  var registerData = {};
  registerData.email = document.getElementById("register-email").value;
  registerData.password = document.getElementById("register-password").value;
  const passwordConfirm = document.getElementById("register-password-confirm").value;
  if (registerData.email.length > 6) {
    emailErrorSpan.style.display = "none";
  }
  if (registerData.password.length > 7) {
    passwordErrorSpan.style.display = "none";
  }
  if (registerData.password == passwordConfirm) {
    passwordConfirmErrorSpan.style.display = "none";
  }
  if (registerData.email == null || registerData.email == "" || registerData.email.length < 7) {
    emailErrorSpan.style.display = "initial";
    emailErrorSpan.innerHTML = 'Please enter a valid email address';
    return;
  }
  if (registerData.password == null || registerData.password == "" || registerData.password.length < 8) {
    passwordErrorSpan.style.display = "initial";
    passwordErrorSpan.innerHTML = 'Please enter a valid password';
    return;
  }
  if (registerData.password != passwordConfirm) {
    passwordConfirmErrorSpan.style.display = "initial";
    passwordConfirmErrorSpan.innerHTML = "Passwords don't match";
    return;
  }
  var registerDataJSON = JSON.stringify(registerData);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (){
      
      if (this.readyState == 4) {
        if (this.status == 200) {
          var responseParse = JSON.parse(this.responseText);
          if (responseParse.user) {
            passwordConfirmErrorSpan.style.color = '#5a9e49';
            passwordConfirmErrorSpan.style.display = "initial";
            passwordConfirmErrorSpan.innerText = "Success!";
            setTimeout(function() { 
              buildLogin(); 
            }, 2000);
          }
        } else if (this.status == 400) {
            console.log(this.response)
            switch (this.response) {
              case '"email" must be a valid email':
                emailErrorSpan.style.display = "initial";
                emailErrorSpan.innerHTML = 'Please enter a valid email address';
                break;
              case 'User with this email address does not exist':
                passwordErrorSpan.style.display = "initial";
                passwordErrorSpan.innerHTML = 'Invalid email/password combination';
                break;            
              case 'Wrong password':
                passwordErrorSpan.style.display = "initial";
                passwordErrorSpan.innerHTML = 'Invalid email/password combination';
                break;
              default:
                console.log(this.response);
            }
        }
      }
  }
  xhr.open("POST","http://localhost:3000/api/user/register",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(registerDataJSON);  
}

function logMeIn() {
  const emailErrorSpan = document.getElementById("login-email-error");
  const passwordErrorSpan = document.getElementById("login-password-error");
  var loginData = {};
  loginData.email = document.getElementById("login-email").value;
  loginData.password = document.getElementById("login-password").value;
  var shouldRemember = document.getElementById("remember-me").checked;
  if (shouldRemember) rememberUser = true;
  console.log(rememberUser);
  if (loginData.email.length > 6) {
    emailErrorSpan.style.display = "none";
  }
  if (loginData.password.length > 7) {
    passwordErrorSpan.style.display = "none";
  }
  if (loginData.email == null || loginData.email == "" || loginData.email.length < 7) {
    emailErrorSpan.style.display = "initial";
    emailErrorSpan.innerHTML = 'Please enter a valid email address';
    return;
  }
  if (loginData.password == null || loginData.password == "" || loginData.password.length < 8) {
    passwordErrorSpan.style.display = "initial";
    passwordErrorSpan.innerHTML = 'Please enter a valid password';
    return;
  }
  var loginDataJSON = JSON.stringify(loginData);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (){
      
      if (this.readyState == 4) {
        if (this.status == 200) {
          console.log(this.response);
          if (rememberUser) storageLocation = localStorage;
          storageLocation.setItem('auth-token', this.response);
          buildBrowse();
        } else if (this.status == 400) {
            console.log(this.response)
            switch (this.response) {
              case '"email" must be a valid email':
                emailErrorSpan.style.display = "initial";
                emailErrorSpan.innerHTML = 'Please enter a valid email address';
                break;
              case 'User with this email address does not exist':
                passwordErrorSpan.style.display = "initial";
                passwordErrorSpan.innerHTML = 'Invalid email/password combination';
                break;            
              case 'Wrong password':
                passwordErrorSpan.style.display = "initial";
                passwordErrorSpan.innerHTML = 'Invalid email/password combination';
                break;
              default:
                console.log(this.response);
            }
        }
      }
  }
  xhr.open("POST","http://localhost:3000/api/user/login",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(loginDataJSON);
};

function refreshLogin() {
  var xhr = new XMLHttpRequest();
  token = storageLocation.getItem('auth-token');
  xhr.onreadystatechange = function (){
      if(this.readyState == 4){
        storageLocation.setItem('auth-token', this.responseText);
      } else {
        buildLogin();
      }
  };
  xhr.open("GET" , "http://localhost:3000/api/user/refresh", true );
  xhr.setRequestHeader('auth-token', token);
  xhr.send();
}

function logMeOut() {
  localStorage.removeItem('auth-token');
  sessionStorage.removeItem('auth-token');
  storageLocation = sessionStorage;
  buildLogin();
}

function lastAction (page, id) {
  storageLocation.setItem('last-action', page);
  if (id) storageLocation.setItem('last-action-id', id);
  if (!id) storageLocation.removeItem('last-action-id');
}

function buildLogin() {
  storageLocation.setItem('last-action', 'buildPage');
  document.getElementById('main').innerHTML = '';
  document.getElementById('main').className = 'login-main'
  var pageHTML =      `<div class=login-container>` +
                        `<div class="brand-area">` +
                          `<i class="fas logo login-logo fa-utensils svg-inline--fa fa-angle-double-right fa-w-14 fa-4x"></i>` +
                          `<span class="brand-name">recipe<b>hub</b></span>` +
                        `</div>` +
                        `<div class="login-form">` +
                          `<div class="login-input-container">` +
                            `<i class="fas fa-envelope"></i>` +
                            `<input type="email" class="login-input" id="login-email" placeholder="Email">` +
                          `</div>` +
                          `<span class="login-error" id="login-email-error"></span>` +
                          `<div class="login-input-container">` +
                            `<i class="fas fa-lock"></i>` +
                            `<input type="password" class="login-input" id="login-password" placeholder="Password">` +
                          `</div>` +
                          `<span class="login-error" id="login-password-error"></span>` +
                          `<div id="rem-me-container">` +
                            `<input type="checkbox" id="remember-me">`+
                            `<label id="rem-me-label" for="remember-me">Remember Me</label><br>` +
                          `</div>` +
                          `<button class="login-submit" id="login-submit" onclick="logMeIn()">Login</button>` +
                          `<p id="login-or">Or</p>` +
                          `<button class="login-submit" id="regster-account" onclick="buildRegister()">Register</button>`+
                        `</div>`;

  document.getElementById('main').innerHTML = pageHTML;
}

function buildRegister () {
  document.getElementById('main').innerHTML = '';
  document.getElementById('main').className = 'login-main'
  var pageHTML =      `<div class="login-container">` +
                        `<div class="brand-area">` + 
                          `<i class="fas logo login-logo fa-utensils svg-inline--fa fa-angle-double-right fa-w-14 fa-4x"></i>` +
                          `<span class="brand-name">recipe<b>hub</b></span>` +
                        `</div>` +
                        `<div class="login-form">` + 
                          `<div class="login-input-container">` +
                            `<i class="fas fa-envelope"></i>` +
                            `<input type="email" class="login-input" id="register-email" placeholder="Email">` +
                          `</div>` +
                          `<span class="login-error" id="register-email-error"></span>` +
                          `<div class="login-input-container">` +
                            `<i class="fas fa-lock"></i>` +
                            `<input type="password" class="login-input" id="register-password" placeholder="Password">` +
                          `</div>` +
                          `<span class="login-error" id="register-password-error"></span>` +
                          `<div class="login-input-container">` +
                            `<i class="fas fa-lock"></i>` +
                            `<input type="password" class="login-input" id="register-password-confirm" placeholder="Confirm Password">` +
                          `</div>` +
                          `<span class="login-error" id="register-password-confirm-error"></span>` +
                          `<button class="login-submit" id="register-account" onclick="registerMe()">Register</button>` +
                          `<p id="login-or">Or</p>` +
                          `<button class="login-submit" id="register-login" onclick="refreshLogin()">Login</button>` +
                        `</div>` +
                      `</div>`;
  document.getElementById('main').innerHTML = pageHTML;                 
}

function buildBrowse() {
  if (!storageLocation.getItem('auth-token')) {
    refreshLogin();
    return;
  }
  document.getElementById('main').innerHTML = '';
  document.getElementById('main').className = 'main'
  var pageHTML = `<div class="item" data-aos="zoom-in-right">` +
                   `<p>Banh mi vaporware hashtag freegan chicharrones woke. Photo booth jianbing swag, distillery wolf chicharrones cloud bread pinterest hexagon meh cardigan asymmetrical artisan. You probably haven't heard of them austin kickstarter, cliche meggings letterpress occupy pickled blog. Cold-pressed vice ethical meh gochujang.</p>` +
                   `<button class="recipe-button">Full Recipe</button>` +
                 `</div>`
  for ( i = 0; i < 15; i++) {
    document.getElementById('main').innerHTML += pageHTML;
  } 
}
/* TODO
function buildPage(page, id) {

}

function buildBrowse() {

}

function buildRecipe(id) {

}

function buildAddRecipe() {

}

function buildRegister() {

}
*/


function getPosts(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (){
      if(this.readyState == 4){
          console.log(this.responseText);
          var antwoordObject = JSON.parse(this.responseText);
          console.log(antwoordObject);
      }
  };
  xhr.open("GET" , "http://localhost:3000/api/posts", true );
  xhr.send();

}


const theme = storageLocation.getItem('theme')
  || (tmp = Object.keys(themeMap)[0],
      storageLocation.setItem('theme', tmp),
      tmp); 
const bodyClass = document.body.classList;
bodyClass.add(theme);

function toggleTheme() {
  console.log('hoi');
  const current = storageLocation.getItem('theme');
  const next = themeMap[current];
  bodyClass.replace(current, next);
  storageLocation.setItem('theme', next);
}

window.onload = function() {
  if (localStorage.getItem('auth-token')) {
    if (!localStorage.getItem('last-action')) {
      localStorage.setItem('last-action', 'buildBrowse');
    }
    storageLocation = localStorage;
    buildBrowse();
    //buildPage(storageLocation.getItem('last-action'));
    return;
  } else {
    buildLogin()
  }
};
