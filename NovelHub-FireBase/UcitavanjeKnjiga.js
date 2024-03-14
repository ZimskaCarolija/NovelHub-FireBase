import { firebaseApp, auth, db } from './FirebaseConfig.js';
export var Zanrovi = ["action", "mystery", "levelup", "isekai","romance","adventure"];
var Knjige = [];
export class Knjiga {
    constructor(id, autorid, naziv, opis, pregledi, slika, zanr) {
        this.id = id;
        this.autorid = autorid;
        this.naziv = naziv;
        this.opis = opis;
        this.pregledi = pregledi;
        this.slika = slika;
        this.zanr = zanr;
    }
    toJSON() {
        return {
            id: this.id,
            autorid: this.autorid,
            naziv: this.naziv,
            opis: this.opis,
            pregledi: this.pregledi,
            zanr: this.zanr
        };
    }
}
function PopuniSelekt()
{
    const ZanriviSelekt = document.getElementById("ZanroviLista");
    ZanriviSelekt.innerHTML = "";
    var opcija = document.createElement("option");
        opcija.text = "";
         opcija.value = "";
    Zanrovi.forEach(zanr=>{
        var opcija = document.createElement("option");
        opcija.text = zanr;
         opcija.value = zanr;
        ZanriviSelekt.appendChild(opcija)
    });
}
function UcitajSve() {
    console.log("sdasdasd");
    Knjige = [];
    const Kolekcija = db.collection('Knjiga');
    const q = Kolekcija.limit(10).get().then(result => {
        result.forEach(doc => {
            var knjiga = new Knjiga(doc.id, doc.data().IdAutora, doc.data().Naziv, doc.data().Opis, doc.data().Pregledi, doc.data().Slika, doc.data().Zanr);
            Knjige.push(knjiga);
        });
        popuni();
        PopuniSelekt();
    });
  
}

function popuni() {
    var sadrzaj = document.getElementById("Sadrzaj");
    sadrzaj.innerHTML = "";
    Knjige.forEach(knjiga => {

        var Id = knjiga.id;
        var url = "Knjiga.html" + '?knjiga=' + Id;
        sadrzaj.innerHTML +=
            "<a class='Stavka' href='" + url + "'>" +
            "<div>" +
            "<div class='slika'>" +
            "<img src='Slike/" + knjiga.slika + "'>" +
            "</div>" +
            "<div class='opis'>" +
            "<h2>" + knjiga.naziv + "</h2>" +
            "<h2>Views : " + knjiga.pregledi + "</h2>" +
            "</div>" +
            "</div>" +
            "</a>";
    });
}
function Pretrazi()
{
    var trazeniString = document.getElementById("Ime").value;
    Knjige = [];
    var izabraniZanr = document.getElementById("ZanroviLista").value;
    const Kolekcija = db.collection("Knjiga");
    Kolekcija 
    .where("Naziv", ">=", trazeniString)
    .where("Naziv", "<=", trazeniString + "\uf8ff")
    .where("Zanr","array-contains",izabraniZanr)
    .limit(10)
    .get()
  .then((result) => {
    result.forEach(doc => {
        var knjiga = new Knjiga(doc.id, doc.data().IdAutora, doc.data().Naziv, doc.data().Opis, doc.data().Pregledi, doc.data().Slika, doc.data().Zanr);
        Knjige.push(knjiga);
    })
    popuni()
  })
  .catch((error) => {
    console.error("Greška prilikom pretrage:", error);
  }); 

}
window.addEventListener("load", () => {
    UcitajSve();
    document.getElementById("DugmePretrazi").addEventListener("click",Pretrazi);
});