
window.onload=()=>{
    comienzo();
}

function comienzo(){
    let clave="&apikey=4e5469a1"
    let url="https://www.omdbapi.com/?";
    let buscar=document.getElementById("buscador");
    let boton=document.getElementById("envio");
    let peticionEnCurso=false;

    boton.addEventListener("click",()=>{
        
        if(!peticionEnCurso){
            peticionEnCurso=true;
            fetch("https://www.omdbapi.com/?s="+buscar.value+"&apikey=4e5469a1").then(response=> response.json()).then(data=>{
                montaje(data.Search);
            });
            peticionEnCurso=false;
        }
    });

}


function montaje(listado){
    listado.forEach(pelicula => {
        let divprin=document.createElement("div");
        divprin.className="pelicula";
        let portada=document.createElement("img");
        portada.src=pelicula.Poster;
        portada.id="poster";
        portada.alt="Portada de la pelicula:"+pelicula.Title;
        divprin.appendChild(portada);
        let titulo=document.createElement("p");
        titulo.innerHTML=pelicula.Title;
        divprin.appendChild(titulo);
        let peliculas=document.getElementById("peliculas");
        peliculas.appendChild(divprin);
        let peticionEnCurso=false;
        divprin.addEventListener("click",()=>{
            if(!peticionEnCurso){
                peticionEnCurso=true;
            fetch("https://www.omdbapi.com/?t="+pelicula.Title+"&apikey=4e5469a1&plot=full").then(response=> response.json()).then(data=>{
                detallePeli(data);
                peticionEnCurso=false;
            });
            }
        });
    });
}


function detallePeli(peli){
    let fondogris=document.createElement("div");
    fondogris.id="fondo";
    fondogris.style.height=window.height+"px";
    let body=document.body
    body.appendChild(fondogris);
    let detalles=document.createElement("div");
    detalles.id="detalles";
    let portada=document.createElement("div");
    portada.id="portada";
    portada.innerHTML="<img src=\""+peli.Poster+"\" alt=\"Poster de pelicula:"+peli.Title+"\">";
    detalles.appendChild(portada);
    let titulo=document.createElement("h2");
    titulo.innerHTML=peli.Title;
    let muestra=document.createElement("div");
    muestra.id="muestra";
    muestra.appendChild(titulo);
    let demasiado=false;
    for(let clave in peli ){
        if(clave!="Title"&&clave!="Poster"&&!demasiado){
            let detalle=document.createElement("p");
            if(clave=="Plot")
                detalle.id="plotdetalle";
            detalle.innerHTML=clave+": "+peli[clave];
            muestra.appendChild(detalle);
        }

        if(muestra.childElementCount>12){
            demasiado=true;
        }
    }
    detalles.appendChild(muestra);
    body.appendChild(detalles);
    fondogris.addEventListener("click",()=>{
        body.removeChild(detalles)
        body.removeChild(fondogris)
    })
}
