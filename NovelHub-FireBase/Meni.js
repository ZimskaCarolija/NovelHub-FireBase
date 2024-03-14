var i = 1; //dali otvara zavisi dal ije aprno

function OtovriMeni() {
    if (i % 2 == 1) {
        var strelaL = document.querySelector("#StrelaL");
        var strelaD = document.querySelector("#StrelaD");
        var strelaC = document.querySelector("#StrelaC");
        var LIstaLIn = document.querySelector("#LIstaLInk");

        strelaL.style.transition = '1s';
        strelaL.style.transform = "rotate(125deg)";
        strelaL.style.left = "-6px";
        strelaL.style.top = "-7px";
        strelaL.style.maxWidth = "20px";

        strelaD.style.transition = '1s';
        strelaD.style.width = "10px";
        strelaD.style.transform = "rotate(-125deg)";
        strelaD.style.left = "6px";
        strelaD.style.top = "-25px";
        strelaD.style.maxWidth = "20px";

        strelaC.style.transition = '1s';
        strelaC.style.transform = "rotate(90deg)";
        strelaC.style.maxWidth = "50px";
        var meni = document.querySelector("#Meni");

        meni.style.transition = '1s';
        meni.style.display = "block";
        meni.style.width = "100%";
        meni.style.maxWidth = "none";
        meni.style.margin = "0 auto";
        meni.style.borderRadius = "0";
        meni.style.padding = "10px";

        LIstaLIn.style.display = 'block';
        LIstaLIn.style.height = 'auto';
    } else {
        ZatvoriMeni();
    }
    i++;
}

function ZatvoriMeni() {
    var meni = document.querySelector("#Meni");
    var spanovi = meni.querySelectorAll("span");
    var LIstaLIn = document.querySelector("#LIstaLInk");
    LIstaLIn.style.display = 'none';
    LIstaLIn.style.height = '0';

    meni.style.margin = "10px";
    meni.style.padding = "10px 20px";
    meni.style.border = "0px solid #F03861";
    meni.style.borderRadius = "50%";
    meni.style.maxWidth = "70px";

    // Postavljanje stilova za spanove unutar #Meni
    spanovi.forEach(function(span) {
        span.style.transform = "rotate(0deg)";
        span.style.left = "0px";
        span.style.top = "0px";
        span.style.maxWidth = "50px";
    });
}

function PromenjenaVelicina() {
    if (window.innerWidth > 800) {
        ZatvoriMeni();
        var meni = document.querySelector("#Meni");
        meni.style.display = 'none';

        var LIstaLIn = document.querySelector("#LIstaLInk");


        var li = LIstaLIn.querySelectorAll("li");
        li.forEach(function(element) {
            element.style.marginTop = "20";
            element.style.marginRight = "30px";
            element.style.marginBottom = "20";
            element.style.marginLeft = "5px";
        });

        LIstaLIn.style.display = "flex";
        LIstaLIn.style.flexDirection = "row";
        LIstaLIn.style.flexWrap = "nowrap";
        LIstaLIn.style.paddingRight = "20px";
        LIstaLIn.style.alignContent = "center";
        LIstaLIn.style.width = "auto";

        //stavke liste
    } else {
        i = 1;
        var LIstaLIn = document.querySelector("#LIstaLInk")
        var meni = document.querySelector("#Meni");
        meni.style.display = 'block';
        LIstaLIn.style.width = "100%";
        LIstaLIn.style.flexDirection = "column";
        LIstaLIn.style.flexWrap = "wrap";
        LIstaLIn.style.order = "2";
        LIstaLIn.style.display = "none";
        LIstaLIn.style.height = "0";

        var li = LIstaLIn.querySelectorAll("li");
        li.forEach(function(element) {
            element.style.marginTop = "30px";
            element.style.marginRight = "0";
            element.style.marginBottom = "30px";
            element.style.marginLeft = "0";
        });
    }
}