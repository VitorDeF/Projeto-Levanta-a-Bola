function previewFile() {
    var preview = document.getElementById('foto');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}


function tipoPessoa(){
    let usuario = {}
    usuario = JSON.parse(sessionStorage.getItem('usuario'));
    if(usuario.tipo == 0){
        meuEspaco.style.display = "none";
        document.getElementById("sair").setAttribute("href","feed.html")
    }
}
        