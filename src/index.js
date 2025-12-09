    let pagina=1;
    let busqueda;
    let primera_buqueda=false;
    let buscar;
    let seleccion;
    let peticionEnCurso;    
    let url="https://www.omdbapi.com/?";
    let clave="a4b93c09";
    let scrolleando=false;
    let arrayfavoritos;
    let busquedafavs;
    window.onload=()=>{
        seleccion=document.getElementById("seleccion");
        buscar=document.getElementById("buscador");
        cambioVentana();
        arrayfavoritos=JSON.parse(localStorage.getItem("pelisFav"))==null?[]:JSON.parse(localStorage.getItem("pelisFav"));
    }


    function cambioVentana(){
        let abrir=document.getElementById("open");
        let buscadorPeli=document.getElementById("BuscadorPelis");
        let freelance=document.getElementById("Free-lance");
        abrir.addEventListener("click",()=>{
            buscadorPeli.style.display="block";
            freelance.style.display="none";
            busquedas();
            comienzo();
        })
    }

    function comienzo(){
        busqueda="Pokemon";
       llamadaapi();
    }


    function busquedas(){
        let marcafavs=document.getElementsByClassName("favoritos");
        marcafavs[0].children[1].addEventListener("change",(e)=>{
            if(e.target.checked){
              busquedafavs=true;
            }
            if(!e.target.checked){
                busquedafavs=false;
            }
            primera_buqueda=true;
            pagina=1;
            if(buscar.value=="" && busquedafavs){
                llamadafavsgeneral();
            }
            else
                llamadaapi();
        })
        //Para cuando cambias la fecha cambie lo que ves
        let anio=document.getElementById("año");
        anio.addEventListener("keyup",(e)=>{
            if(!isNaN(Number(anio.value))){
                let valor=Number (anio.value);
                if(buscar.value.length>=3 &&(valor>0)&&anio.value.length>=4){
                    primera_buqueda=true;
                    pagina=1;
                    busqueda=buscar.value;
                    llamadaapi()
                }
                if(buscar.value==""){
                    if(busquedafavs){
                        llamadafavsgeneral();
                    }else{
                        busqueda="pokemon";
                        llamadaapi();
                    }
                }
            }
        });
        //Estos dos son para cuando cambias algo en el nombre 
        buscar.addEventListener("keyup",(e)=>{    
            if(buscar.value.length>=3){
                if((e.key.length==1||e.key=="Backspace")&&((!isNaN(Number(anio.value))&&anio.value.length>=4)||anio.value=="")){
                    primera_buqueda=true;
                    pagina=1;
                    busqueda=buscar.value;
                    llamadaapi()
                }
            }
            if(buscar.value==""){
                if(busquedafavs){
                    llamadafavsgeneral();
                }else{
                    busqueda="pokemon";
                    llamadaapi();
                }
                    
            }
        });

        buscar.addEventListener("change",()=>{
            if(buscar.value.length>=3){
                primera_buqueda=true;
                pagina=1;
                busqueda=buscar.value;
                llamadaapi()
                }
        });

        window.onscroll=()=>{
            scrolleando=true;
            if((window.innerHeight+window.scrollY)>= (document.body.offsetHeight-document.body.offsetHeight*0.15)){
                if(!busquedafavs){
                    llamadaapi();
                    pagina++;
                }
            }
        }
    }

    function llamadaapi(){
        let anio=document.getElementById("año");
        if(!peticionEnCurso){
            peticionEnCurso=true;
            fetch(url+"s="+busqueda+"&apikey="+clave+"&page="+pagina+(seleccion.value!=""?("&type="+seleccion.value):"")+(anio.value!=""?("&y="+anio.value):"")).then(response=> response.json()).then(data=>{
                montajeBusqueda(data.Search);
                peticionEnCurso=false;
            });
           
        }
    }

    function llamadafavsgeneral(){
        let peliculas=document.getElementById("peliculas");
        peliculas.innerHTML="";
        arrayfavoritos.forEach((codigo,index)=>{
            fetch(url+"i="+codigo+"&apikey="+clave).then(response=> response.json()).then(data=>{
                creacionpelis(data);
            });
        })
    }


    function montajeBusqueda(listado){
        let peliculas=document.getElementById("peliculas");
        if(primera_buqueda){
            peliculas.innerHTML="";
            primera_buqueda=false;
        }
        listado.forEach(pelicula =>{
            if(busquedafavs && arrayfavoritos.indexOf(pelicula.imdbID)!=-1)
                creacionpelis(pelicula);
            else
                if(!busquedafavs)
                    creacionpelis(pelicula);
        })
    }


    function creacionpelis(pelicula){
        let peliculas=document.getElementById("peliculas");
         let divprin=document.createElement("div");
            divprin.className="peliculas__pelicula";
            let portada=document.createElement("img");
            portada.src=pelicula.Poster;
            portada.className="peliculas__peliculas--img";        
            portada.onerror=()=>{
                portada.src="src/img/Error.png";
            }
            divprin.appendChild(portada);
            let titulo=document.createElement("p");
            titulo.innerHTML=pelicula.Title;
            titulo.className="peliculas__pelicula__pelifoot__titulo"
            let botonfav=document.createElement("div");
            let pelifoot=document.createElement("div");
            pelifoot.className="peliculas__pelicula__pelifoot";
            botonfav.appendChild(document.createElement("img"));
            botonfav.className="peliculas__pelicula__pelifoot__favboton";
            botonfav.children[0].src=arrayfavoritos.indexOf(pelicula.imdbID)==-1?"./src/img/Corazon-Vacio.png":"./src/img/Corazon-Lleno.png"
            pelifoot.appendChild(titulo);
            pelifoot.appendChild(botonfav);
            divprin.appendChild(pelifoot)
            peliculas.appendChild(divprin);
            peticionEnCurso=false;
            portada.addEventListener("click",()=>{
                if(!peticionEnCurso){
                    peticionEnCurso=true;
                    fetch("https://www.omdbapi.com/?i="+pelicula.imdbID+"&apikey="+clave+"&plot=full").then(response=> response.json()).then(data=>{
                    detallePeli(data);
                        peticionEnCurso=false;
                    });
                }
            });
            botonfav.addEventListener("click",()=>{
                let imagen=botonfav.children[0];
                src=imagen.src;
                if(src.indexOf("Corazon-Vacio.png")!=-1){
                    imagen.src="./src/img/Corazon-Lleno.png"
                    arrayfavoritos==null?arrayfavoritos=[pelicula.imdbID]:arrayfavoritos.push(pelicula.imdbID);
                }else{
                    imagen.src="./src/img/Corazon-Vacio.png";
                    arrayfavoritos=arrayfavoritos.filter(peli=>peli!=pelicula.imdbID)
                }
                localStorage.setItem("pelisFav",JSON.stringify(arrayfavoritos));
            })
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
        let imgport=document.createElement("img");
        imgport.src=peli.Poster;
        portada.appendChild(imgport);
        imgport.onerror=()=>{
            imgport.src="src/img/Error.png";
        }
        
        detalles.appendChild(portada);
        let titulo=document.createElement("h2");
        titulo.id="muestra__titulo"
        titulo.innerHTML=peli.Title;
        let muestra=document.createElement("div");
        muestra.id="muestra";
        muestra.appendChild(titulo);
        for(let clave in peli ){
            if(clave!="Title"&&clave!="Poster"){
                let detalle=document.createElement("p");
                if(clave=="Plot")
                    detalle.id="plotdetalle";
                detalle.innerHTML=clave+": "+peli[clave];
                muestra.appendChild(detalle);
            }
        }
        detalles.appendChild(muestra);
        body.appendChild(detalles);
        fondogris.addEventListener("click",()=>{
            body.removeChild(detalles)
            body.removeChild(fondogris)
        })
    }
