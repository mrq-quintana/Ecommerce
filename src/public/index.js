const socket = io();

socket.on('actualiza', data=>{
    let prod = data.products;
    fetch('templates/productsTable.handlebars').then(string=> string.text()).then(template=>{
        const plantilla = Handlebars.compile(template);
        const objPlantilla={
            productos:prod
        }
        const html = plantilla(objPlantilla);
        let div = document.getElementById('idProductos');
        div.innerHTML= html;
    })
})

let input = document.getElementById('idChat');
let user = document.getElementById('user');
input.addEventListener('keyup',(e)=>{
    if(e.key==="Enter"){
        if(e.target.value){
            let chat ={ 
                usuario:user.value, 
                mensaje:e.target.value, 
            }
            socket.emit('msj', chat)
        }else{
            console.log('Mensaje vacio')
        }
    }
})

socket.on('log',mensajes=>{
    let p =document.getElementById('log');
    let todosMsj = mensajes.map(message=>{
        return `<div>
                    <span><p>${message.usuario} dice: ${message.mensaje}</p><p> ${message.created_at}</p></span>
                </div>`
    }).join('');
    p.innerHTML = todosMsj;
})

document.addEventListener('submit',enviarForm);

function enviarForm(event){
    event.preventDefault();
    let form= document.getElementById('formProduct');
    let data = new FormData(form);
    fetch('/api/productos',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        console.log(json.error);
        if(json.error === -2){
            Swal.fire({
                title:'No se puede guardar',
                text:json.message,
                icon:'error',
                timer:4000,
            })
        } else{
            Swal.fire({
                title:'Guardado',
                text:json.message,
                icon:'success',
                timer:2000,
            })
        }
    })
    document.getElementById('formProduct').reset();
}
document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "Foto de producto"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}

