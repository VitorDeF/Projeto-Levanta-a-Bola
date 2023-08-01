document.querySelector("#show_login").addEventListener("click",function(){
    document.querySelector(".popup").classList.add("active");
});
document.querySelector(".popup .close_btn").addEventListener("click",function(){
    document.querySelector(".popup").classList.remove("active");
});
document.querySelector("#show_cadastro").addEventListener("click",function(){
    document.querySelector(".popupcadastro").classList.add("active");
});
document.querySelector(".popupcadastro .close_btn").addEventListener("click",function(){
    document.querySelector(".popupcadastro").classList.remove("active");
});