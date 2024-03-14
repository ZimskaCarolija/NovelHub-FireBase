import {db } from './FirebaseConfig.js';
import { Knjiga} from './UcitavanjeKnjiga.js';

var Knjige = [];
function Ucitaj()
{
    Knjige = [];
    const Kolekcija = db.collection('Knjiga');
    const q = Kolekcija.orderBy("Pregledi", "desc").limit(25).get().then(result => {
        result.forEach(doc => {
            var knjiga = new Knjiga(doc.id, doc.data().IdAutora, doc.data().Naziv, doc.data().Opis, doc.data().Pregledi, doc.data().Slika, doc.data().Zanr);
            Knjige.push(knjiga);
        });
        popuni();
    });

}
Ucitaj();
function popuni() {
    var sadrzaj = document.getElementById("SadrzajPopularno");
    sadrzaj.innerHTML = "";
    var i=0;
    Knjige.forEach(knjiga => {
        i++;
        var Id = knjiga.id;
        var url = "Knjiga.html" + '?knjiga=' + Id;
        sadrzaj.innerHTML +=
            "<a class='Stavka' href='" + url + "'>" +
            "<div>" +
            "<div class='RedniBroj'>"+i+"</div>"+
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