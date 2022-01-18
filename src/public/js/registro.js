let form  = document.getElementById("registerForm");
form.addEventListener('submit',function(event){
    event.preventDefault();
    let data = new FormData(form);
    let datosUsuario ={
        nombre: data.get('first_name'),
        apellido: data.get('last_name'),
        edad: data.get('age'),
        usuario: data.get('username'),
        email: data.get('email'),
        password: data.get('password')
    }
    fetch('/api/register',{
        method:"POST",
        body:JSON.stringify(datosUsuario),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json()).then(json=>{
        console.log(json.error);
        if(json.error === -2){
            Swal.fire({
                title:'No se puede guardar',
                text:json.message,
                icon:'error',
                timer:5000,
            })
        } else{
            Swal.fire({
                title:'Guardado',
                text:json.message,
                icon:'success',
                timer:5000,
            })
            setTimeout(location.replace('./pages/login.html'),7000);
        }
    })
    form.reset();
}) 