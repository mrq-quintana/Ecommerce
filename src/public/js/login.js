
let form  = document.getElementById("loginForm");
form.addEventListener('submit',function(event){
    event.preventDefault();
    let data = new FormData(form);
    let loginUsuario ={
        email: data.get('email'),
        password: data.get('password')
    }
    fetch('/api/login',{
        method:"POST",
        body:JSON.stringify(loginUsuario),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=> result.json()).then(json=>{
        if(json.error===-2){
            Swal.fire({
                title:'Usuario no registrado',
                text:json.message,
                icon:'error',
                timer:5000,
            })
        } else{
            Swal.fire({
                title:'Bienvenido',
                text:json.message,
                icon:'success',
                timer:5000,
            })
            setTimeout(location.replace('./gestorArt.html'),7000);
        }
    })
    form.reset();
})