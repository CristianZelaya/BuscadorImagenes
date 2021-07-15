(() => {

    const resultado = document.querySelector('#resultado'),
          formulario = document.querySelector('#formulario'),
          paginacionDIV = document.querySelector('#paginacion');
    
    const registrosPorPaginas = 40;
    let totalPaginas,
        iterador,
        paginaActual;
    
    window.onload = () => {
    
        formulario.addEventListener('submit', validarFormulario);
    
    }
    
    function validarFormulario( e ) {
    
        e.preventDefault();
    
        const terminoBusqueda = document.querySelector('#termino').value;
    
        if ( terminoBusqueda === '') {
    
            mostrarAlerta('Agregar un término de búsqueda');
            return;
    
        }
    
        buscarImagenes();
    
    }
    
    function mostrarAlerta( mensaje ) {
    
        const  existeAlerta = document.querySelector('.error');
    
        if ( !existeAlerta ) {
    
            const alerta = document.createElement('p');
            alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
            'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'error');
        
            alerta.innerHTML = `
                <strong>Error!</strong>
                <span class="block sm:inline">${ mensaje }</span>
            `;
        
            formulario.appendChild(alerta);
        
            setTimeout(() => {
        
                alerta.remove();
                
            }, 3000);
    
        }
    
    }
    
    function buscarImagenes() {
    
        const termino = document.querySelector('#termino').value;
        const key = '22468750-a7117ffede98f3b90ec4875b5';
        const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPaginas}&page=${paginaActual}`;
    
        fetch( url )
            .then( respuesta => respuesta.json())
            .then( resultado => {
    
                totalPaginas = calcularPagina( resultado.totalHits);
                mostrarImagenes( resultado.hits );
    
            })
    
    }
    
    // Generado que va a registrar la cantidad de elementos de acuerdo  las paginas
    function *crearPaginador( total ) {
    
        for( let i = 1; i <= total; i++ ) {
    
            yield i;
    
        }
    
    }
    
    function calcularPagina( total ) {
    
        return parseInt( Math.ceil( total / registrosPorPaginas ) );
    
    }
    
    function mostrarImagenes( imagenes ) {
    
        while (resultado.firstChild) {
    
            resultado.removeChild(resultado.firstChild);
            
        }
    
        imagenes.forEach( imagen => {
    
            const { previewURL, likes, views, largeImageURL } = imagen;
    
            resultado.innerHTML += `
                <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                    <div class="bg-white">
                        <img class="w-full" src="${previewURL}">
                        <div class="p-4">
                            <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span> </p>
                            <p class="font-bold"> ${views} <span class="font-light"> Veces vistas </span> </p>
                            <a 
                                class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                                href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                            >
                                Ver Imagen
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
        });
    
        while ( paginacionDIV.firstChild ) {
    
            paginacionDIV.removeChild( paginacionDIV.firstChild );
    
        }
    
        imprimirPaginador();
    
    }
    
    function imprimirPaginador() {
    
        iterador = crearPaginador( totalPaginas );
    
        while( true ) {
    
            const { value, done } = iterador.next();
            if ( done ) return;
    
            // Caso contrario, genera un boton por cada pagiona en el generador
            const boton = document.createElement('a');
            boton.href = '#';
            boton.dataset.pagina = value;
            boton.innerHTML = value;
            boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');
    
            boton.onclick = () => {
    
                paginaActual = value;
                buscarImagenes();
    
            }
    
            paginacionDIV.appendChild( boton );
    
        }
    
    }
    
})();