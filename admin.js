const rootDiv = document.getElementById("internshipRoot");
const addInternshipbtn = document.getElementById('addinternshipbtn')
const viewFeedbackbtn = document.getElementById('viewFeedback')
const viewInternshipbtn = document.getElementById('viewInternship')

function checkAuth() {
    const token = localStorage.getItem("Authtoken");
    if (!token) {
      location.href = "/adminlogin";
      return false
    }
    return token;
}

const token = checkAuth()

function clearRootDiv(){
    rootDiv.innerHTML = ''
}

function createInternshipElement(item) {
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
        <div>
          <button onclick="deleteInternship(${item.ID})">Delete internship</button>
        </div>
      </div>
    </section>
    `;
    return content;
  }

function createFeedbackElement(item){
    const content = `<section class="section" id="section1">
    <div class="section-content">
    <div>
    ${item.timestamp}
    </div>
      <div class="section-info">
        <h2>${item.email}</h2>
        <p>${item.message}</p>
      </div>
      <div>
      </div>
    </div>
  </section>`
  return content
}
  
  function showInternships(data) {
    clearRootDiv()
    let myhtml = "";
    data.map((item) => {
      myhtml += createInternshipElement(item);
    });
    rootDiv.innerHTML += myhtml;
  }
  
  function noData(datatype) {
    clearRootDiv()
    rootDiv.innerText = `NO ${datatype} AVAILABLE`;
  }

function showFeedback(data){
    clearRootDiv()
    let myhtml = ``;
    data.map((item)=>{
        myhtml += createFeedbackElement(item)
    })
    rootDiv.innerHTML += myhtml
}
  

const newInternship = async ()=>{
    const { value: formValues } = await Swal.fire({
        title: "Add New Internship",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="company">
          <input id="swal-input2" class="swal2-input" placeholder="title">
          <input id="swal-input3" class="swal2-input" placeholder="link">
          <input id="swal-input4" class="swal2-input" type="file" name="files">
        `,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").files[0],
          ];
        }
      });
      if (formValues) {
        // Swal.fire(JSON.stringify(formValues));
        let form = new FormData()
        form.append("company",formValues[0])
        form.append("heading",formValues[1])
        form.append("link",formValues[2])
        form.append("file",formValues[3])
        let result = await fetch('/api/addinternship',{
            method:"POST",
            headers:{
                "auth":token
            },
            body:form
        })
        result = await result.json()
        if (result.success){
            await Swal.fire(result.msg)
            getInternships()
        }else{
            await Swal.fire(result.msg)
            location.href='/login'
        }
      } 
}

const deleteInternship = async(id)=>{
    console.log('delete',id)
    const { value: accept } = await Swal.fire({
        title: "Delete Internship",
        input: "checkbox",
        inputValue: 1,
        inputPlaceholder: `
          This operation cannot be reverted
        `,
        confirmButtonText: `
          Continue&nbsp;<i class="fa fa-arrow-right"></i>
        `,
        inputValidator: (result) => {
          return !result && "You need to agree with T&C";
        }
      });
      if (accept) {
        // Swal.fire("You agreed with T&C :)");
        let result = await fetch('/api/delinternship',{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                "auth":token
            },
            body:JSON.stringify({
                id:id
            })
        })
        result = await result.json()
        console.log(result)
        if (result.success){
            await Swal.fire(result.msg)
            clearRootDiv()
            getInternships()
        }else{
            await Swal.fire(result.msg)
            location.href='/login'
        }
      }
}


const getAllFeedback = async ()=>{
    let result = await fetch('/api/feedback',{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
            "auth":token
        },
    })
    result = await result.json()
    console.log('getallfeedback result',result)
    if (result.success){
        if (result.data.length == 0) {
            noData('FEEDBACK')
        }
        clearRootDiv()
        showFeedback(result.data)
    }else{
        await Swal.fire(result.msg)
        location.href='/login'
    }
}

const getAllStudents = async()=>{
    let result = await fetch('/api/feedback',{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
            "auth":token
        },
    })
    result = await result.json()
    console.log('getallfeedback result',result)
    if (result.success){
        if (result.data.length == 0) {
            noData('FEEDBACK')
        }
        clearRootDiv()
        showFeedback(result.data)
    }else{
        await Swal.fire(result.msg)
        location.href='/login'
    }
}

addInternshipbtn.addEventListener('click',newInternship)
viewFeedbackbtn.addEventListener('click',getAllFeedback)
viewInternshipbtn.addEventListener('click',getInternships)


async function getInternships() {
  console.log("fetching interships");
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
      noData('INTERNSHIP');
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

// getInternships();
