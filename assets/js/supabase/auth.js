var SUPABASE_URL = '<project-url>';
var SUPABASE_KEY = '<public-api-key>';

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.userToken = null;

function signUp() {
  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;
  const confirm = document.getElementById("input-confirm-password").value;

  if(password == confirm) {
    supabase.auth
    .signUp({ email, password })
    .then((response) => {
      response.error ? alert(response.error.message) : setToken(response);
    })
    .catch((err) => {
      alert(err);
    });
  }
}

function signIn() {
  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;

  supabase.auth
    .signIn({ email, password })
    .then((response) => {
      response.error ? alert(response.error.message) : setToken(response);
    })
    .catch((err) => {
      alert(err.response.text);
    });
}

function fetchUserDetails() {
  alert(JSON.stringify(supabase.auth.user()));
}

var access_token, refresh_token;

function signOut() {
  supabase.auth
    .signOut()
    .then((_response) => {
      access_token = refresh_token = '';
      document.getElementById("sign-up-link").style.display = "inline";
      document.getElementById("sign-in-link").style.display = "inline";
      document.getElementById("sign-out-button").style.display = "none";
      alert('Logout successful');
    })
    .catch((err) => {
      alert(err.response.text)
    })
}

function setToken(response) {
  if (response.user.confirmation_sent_at && !response?.session?.access_token) {
    alert('Confirmation Email Sent')
  } else {
    access_token = response.session.access_token
    refresh_token = response.session.refresh_token

    document.getElementById("sign-up-link").style.display = "none";
    document.getElementById("sign-in-link").style.display = "none";
    document.getElementById("sign-out-button").style.display = "inline";

    alert('Logged in as ' + response.user.email)
  }
}

if(supabase.auth.user()) {
  document.getElementById("sign-up-link").style.display = "none";
  document.getElementById("sign-in-link").style.display = "none";
  document.getElementById("sign-out-button").style.display = "inline";

  if(document.getElementById("text-area-auth-status"))
    document.getElementById("text-area-auth-status").value = JSON.stringify(supabase.auth.user(), null, "  ");
}
else {
  document.getElementById("sign-up-link").style.display = "inline";
  document.getElementById("sign-in-link").style.display = "inline";
  document.getElementById("sign-out-button").style.display = "none";

  if(document.getElementById("text-area-auth-status"))
    document.getElementById("text-area-auth-status").value = "signed out";
}
