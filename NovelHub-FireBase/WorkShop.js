import { firebaseApp, auth, db } from './FirebaseConfig.js';
import { Knjiga,Zanrovi } from './UcitavanjeKnjiga.js';
let KorisnikId = "";
let KorisnikEmail = "";
let Knjige = [];
var Coveri = ["SupremeMagus.jpg","SlikaVanpire.jpg"];
 var IzabraniZanrovi = [];
//URADITI PROVERU ALI JE KORISINK ULAGOVAN PRWKO auth().onAuthStateChanged(function(user)
function PokupiKOrisnika() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            KorisnikEmail = auth.currentUser.email;
            const Kolekcija = db.collection('Korisnik');
        
            const q = Kolekcija.where("Email", "==", KorisnikEmail).get().then(querySnapshot => {
                console.log(KorisnikEmail);
                if (!querySnapshot.empty) {
                    KorisnikId = querySnapshot.docs[0].id;
                    document.getElementById("KOrisnik").innerHTML = querySnapshot.docs[0].data().Naziv;
                    console.log(querySnapshot.docs[0].data().Naziv);
                    UcitajKnjige();
                   popuniSelectove();
                }
            }).catch(error => {
                console.error("Greška pri pristupu kolekciji:", error);
            });
        } else {
            auth.signOut();
            var sadrzaj = document.getElementById("Knjige");
            sadrzaj.innerHTML = "";
            KorisnikEmail  = "";
            KorisnikId = "";
            document.getElementById("KOrisnik").innerHTML = "";
        }
      });


}

PokupiKOrisnika(); function DodajZanr()
{
    console.log("Dodaj zanr je pozavan");
    const ZanriviSelekt = document.getElementById("ZanroviLista");
    var vrednostZanra = ZanriviSelekt.value;
    if(IzabraniZanrovi.includes(vrednostZanra))
    return;
    IzabraniZanrovi.push(vrednostZanra);
    POpuniZanrovimaDiv()
} function POpuniZanrovimaDiv()
{
    var ZanroviDodati = document.getElementById("ZanroviDodati");
    ZanroviDodati.innerHTML = "";
    IzabraniZanrovi.forEach(zanr =>{
        ZanroviDodati.innerHTML+="<div class='Zanr'> "+zanr+" </div>";

    });
}
function Izbaci(event) {
    var kliknutiElement = event.target;
    if (kliknutiElement.classList.contains('Zanr')) {
        let index = IzabraniZanrovi.indexOf( kliknutiElement.innerHTML);
        IzabraniZanrovi.splice(index,1);
        
    }
    POpuniZanrovimaDiv();
}
function DodajKnjigu()
{
        if(KorisnikId =="")
        {
            alert("Erro User id ");
            return;
        }
        var Naziv = document.getElementById("NoveNaziv").value;
        var Opis = document.getElementById("Opis").value;
        var CoverSlika =  document.getElementById("CoverLista").value;
        if(Naziv == "" || Opis == "")
        {
            alert("title and description must not be empty")
            return;
        }    
    
        db.collection("Knjiga").add({
            IdAutora : "/Korisnik/"+KorisnikId,
            Naziv : Naziv,
            Opis : Opis,
            Pregledi : 0,
            Slika : CoverSlika,
            Zanr : IzabraniZanrovi
        }).then(() => {
            location.reload();
        }).catch(error => {
            console.error("Error adding document: ", error);
        });
       
}

function popuniSelectove()
{
    const ZanriviSelekt = document.getElementById("ZanroviLista");
    const CoverSelekt = document.getElementById("CoverLista");
    ZanriviSelekt.innerHTML = "";
    CoverSelekt.innerHTML = "";
    Zanrovi.forEach(zanr=>{
        var opcija = document.createElement("option");
        opcija.text = zanr;
         opcija.value = zanr;
        ZanriviSelekt.appendChild(opcija)
    });
    Coveri.forEach(zanr=>{
        var opcija = document.createElement("option");
        opcija.text = zanr;
         opcija.value = zanr;
         CoverSelekt.appendChild(opcija)
    });
}
function UcitajKnjige() {
    Knjige = [];
    const Kolekcija = db.collection('Knjiga');
    const q = Kolekcija.where("IdAutora", "==", "/Korisnik/" + KorisnikId).get().then(result => {
        console.log(KorisnikId);
        result.forEach(doc => {
            var knjiga = new Knjiga(doc.id, doc.data().IdAutora, doc.data().Naziv, doc.data().Opis, doc.data().Pregledi, doc.data().Slika, doc.data().Zanr);
            Knjige.push(knjiga);
        });
        popuni();
    });
}

function popuni() {
    const sadrzaj = document.getElementById("Knjige");
    sadrzaj.innerHTML = "";
    Knjige.forEach(knjiga => {
        const KnjigaDiv = document.createElement("div");
        KnjigaDiv.className = "KnjigaPom";
        console.log(knjiga);
        var Id = knjiga.id;
        var url = "Chapters.html" + '?knjiga=' + Id;
        KnjigaDiv.innerHTML +=
            "<div class = 'Knjiga' >" +
            "<div class = 'Naziv' > " + knjiga.naziv + " </div> <a href='"+url+"'>Chapters</a> <a class='delete-dugme' data-id='"+Id+"'> Delete </a> </div ></div>";
        sadrzaj.appendChild(KnjigaDiv);
        
    });
    sadrzaj.addEventListener('click',function (event){
        if(event.target.classList.contains("delete-dugme"))
        {
            const chapterId = event.target.getAttribute("data-id");
            Izbrisi(chapterId);
        }
    });
}
function Izbrisi(Id)
{
const Kolekcija = db.collection('Knjiga');
const Dokument = Kolekcija.doc(Id);
Dokument.delete().then(() => {
    location.reload();
}).catch(error => {
    console.error("Error deleting document: ", error);
});
}
document.getElementById("DugmeDodajzanr").addEventListener("click",DodajZanr);
document.getElementById('ZanroviDodati').addEventListener('click', Izbaci);
document.getElementById("CreairajKnjigu").addEventListener("click",DodajKnjigu);