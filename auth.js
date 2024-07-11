
function checkAuth() {
  const token = localStorage.getItem("Authtoken");
  console.log("checking auth...");
  if (!token) {
    return false;
  }
  return true;
}

function logout_fn() {
  localStorage.removeItem("Authtoken");
  console.log('logging out...')
  location.href='/'
}

const isLoggedIn = checkAuth();
if (!isLoggedIn) {
  let internships = document.getElementById("internships");
  console.log("removing internship");
  internships.remove();
  logout.remove();
} else {
  const logout = document.getElementById("logout");

  logout.addEventListener("click", () => {
    logout_fn();
  });
}
