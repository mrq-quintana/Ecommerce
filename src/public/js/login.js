let form  = document.getElementById("loginForm");
form.addEventListener('submit',function(event){
    event.preventDefault();
    let data = new FormData(form);
    let loginUsuario ={
        usuario: data.get('usuario'),
        password: data.get('password')
    }
    fetch('/api/login',{
        method:"POST",
        body:JSON.stringify(loginUsuario),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        return result.json();
    }).then(json=>{
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
        }
        location.replace('./gestorArt.html')
    })
    form.reset();
})