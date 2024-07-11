const rootDiv = document.getElementById("internshipRoot");

function checkAuth() {
  const token = localStorage.getItem("Authtoken");
  if (!token) {
    location.href = "/login";
  }
  return token;
}

function createElement(item) {
  const content = `
  <section class="section" id="section1">
    <div class="section-content">
      <div class="section-image-wrapper">
        <a href='${item.link}' target='_blank'>
          <img src="${item.image}" alt="Image 1" class="section-img">
        </a>
      </div>
      <div class="section-info">
        <h2>${item.company}</h2>
        <p>"${item.heading}"</p>
      </div>
    </div>
  </section>
  `;
  return content;
}

function showInternships(data) {
  let myhtml = "";
  data.map((item) => {
    myhtml += createElement(item);
  });
  rootDiv.innerHTML += myhtml;
}

function noInternships() {
  rootDiv.innerText = "NO INTERNSHIPS AVAILABLE";
}

async function getInternships() {
  console.log("fetching interships");
  const token = checkAuth();
  if (!token) return;
  let result = await fetch("/api/internships", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      auth: token,
    },
  });
  result = await result.json();
  console.log("result returned", result);
  if (result.success) {
    if (result.data.length == 0) {
      noInternships();
    } else {
      showInternships(result.data);
    }
  } else {
    Swal.fire({
      title: "Oops...",
      text: result?.err,
      icon: "error",
    });
  }
}

getInternships();
