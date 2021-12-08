const socket = io();

socket.on('actualiza', data=>{
    let prod = data.product;
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
            let timestamp = Date.now();
            let time = new Date(timestamp);
            socket.emit('msj', { user:user.value, message:e.target.value, hoy:time.toLocaleDateString() , hora:time.toTimeString().split(" ")[0]})
        }else{
            console.log('Mensaje vacio')
        }
    }
})

socket.on('log',data=>{
    let p =document.getElementById('log');
    let todosMsj = data.map(message=>{
        return `<div>
                    <span>${message.user} dice: ${message.message}, ${message.hoy}, ${message.hora}</span>
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
        Swal.fire({
            title:'Guardado',
            text:json.message,
            icon:'success',
            timer:2000,
        })
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

