

const login = async ()=>{
    let email = document.getElementById('loginEmail')
    let password = document.getElementById('loginPassword')
    console.log(email.value,password.value)
    let result  = await fetch('/login',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email: email.value,
            password:password.value
        })
    })
    result = await result.json()
    if (result.success){
        localStorage.setItem("Authtoken",result.token)
        await Swal.fire({
            title: "Logged In",
            text: "You're logged in!Enjoy",
            icon: "success"
          });
        location.href='/'
    }else{
        Swal.fire({
            title: "Oops...",
            text: result.message,
            icon: "error"
          });
    }
    
}

const signup = async ()=>{
    let username = document.getElementById('username')
    let email = document.getElementById('email')
    let password = document.getElementById('password')

    let result = await fetch('/signup',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            username:username.value,
            email:email.value,
            password:password.value})
    })

    result = await result.json()
    if (result.success){
        await Swal.fire({
            title: "Great!",
            text: result.message,
            icon: "success"
          });
        location.href='/login'
    }else{
        Swal.fire({
            title: "Oops...",
            text: result.message,
            icon: "error"
          });
    }

}

const adminLogin = ()=>{
    let email = document.getElementById('email')
    let password = document.getElementById('password')

}