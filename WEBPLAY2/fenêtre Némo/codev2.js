var addZoom = function(target, mousetarget) {
    // FETCH CONTAINER + IMAGE
    //Récupère le container zoomé par son ID
    var container = document.getElementById(target);
    //Récupère le container pour les evenements souris par son ID
    var mouseContainer = document.getElementById(mousetarget);
    //Source de l'image zoomé
    var imgsrc = "fond2.png";
    //Création d'un objet Image
    var img = new Image();
    // LOAD IMAGE + ATTACH ZOOM
    img.src = imgsrc;
    //Une fois l'image chargé on créé les comportements
    img.onload = function() {
        //Calcul de la taille de l'image chargé en largeur, hauteur, ratio
        var imgWidth = img.naturalWidth,
            imgHeight = img.naturalHeight,
            ratio = imgHeight / imgWidth,
            percentage = ratio * 100 + '%';
        // ZOOM ON MOUSE MOVE
        mouseContainer.onmousemove = function(e) {
            var boxWidth = container.clientWidth; //Variable de la largeur du container
            var xPos = e.pageX - this.offsetLeft; //Variable de la position X
            var yPos = e.pageY - this.offsetTop; //Variable de la position Y
            var xPercent = xPos / (boxWidth / 100) + '%';
            var yPercent = yPos / (boxWidth * ratio / 100) + '%';
            container.style.backgroundPosition = xPercent + ' ' + yPercent;
            container.style.backgroundSize = imgWidth + 'px';
        };
        document.onmousemove = suitsouris;

        function suitsouris(e) {
            if (navigator.appName == "Microsoft Internet Explorer") {
                var x = e.x + document.body.scrollLeft;
                var y = e.y + document.body.scrollTop;
            } else {
                var x = e.pageX;
                var y = e.pageY;
            }
            document.getElementById("Jumelles").style.left = (-600 + e.pageX - mouseContainer.offsetLeft) + 'px';
            document.getElementById("Jumelles").style.top = (-600 + e.pageY - mouseContainer.offsetTop) + 'px';
            console.log(e.pageX - mouseContainer.offsetLeft);
        };
        // RESET ON MOUSE LEAVE
        mouseContainer.onmouseleave = function(e) {
            container.style.backgroundPosition = 'center';
            container.style.backgroundSize = 'cover';
            container.style.display = "none";
        };
        // APPEAR ON MOUSE ENTER
        mouseContainer.onmouseover = function() {
            container.style.display = "block";
        };
    }
};
//Déclenché une fois que la page à fini de se charger
window.addEventListener("load", function() {
    //passe à la fonction le container zommé et le container pour les évenements souris
    addZoom("fenetre2", "fenetre");
});