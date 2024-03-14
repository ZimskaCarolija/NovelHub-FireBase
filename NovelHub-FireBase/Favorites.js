import { firebaseApp, auth, db } from './FirebaseConfig.js';
import { Knjiga } from './UcitavanjeKnjiga.js';

var KorisnikId= "";

function Pokreni()//kada se ucita stranica
{
    var user = firebase.auth().currentUser;
    if(user)
    {
    UzmiKOrisnika();
    }
}
function UzmiKOrisnika()
{   
    const Kolekcija = db.collection("Korisnik");
    const q = Kolekcija.where("Email", "==", firebase.auth().currentUser.email).get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            KorisnikId = querySnapshot.docs[0].id;
            UzmiKnjige();
            UzmiChaptere()
        }
    }).catch(error => {
        console.error("Greška pri pristupu kolekciji:", error);
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      Pokreni();
    } else {
      KorisnikId = "";
      document.getElementById("SadrzajFavorites").innerHTML = "";
      document.getElementById("SadrzajNastavi").innerHTML = "";
    }
  });

function UzmiKnjige()
{
const Kolekcija = db.collection("KorisnikFavorite");

const q = Kolekcija.where("IdKorisnika","==","/Korisnik/"+KorisnikId).get().then(querySnapshot  => {

querySnapshot.forEach(element => {
    var KnjigaId =element.data().IdKnjige;
    const Kolekcija2 = db.collection("Knjiga")
    const Dokument = Kolekcija2.doc(KnjigaId.substring(8));
    Dokument.get().then(result =>{
        if (result.exists) {
            var knjiga = new Knjiga(result.id, result.data().IdAutora, result.data().Naziv, result.data().Opis, result.data().Pregledi, result.data().Slika, result.data().Zanr);
            var Id = knjiga.id;
            var url = "Knjiga.html" + '?knjiga=' + Id;
            var sadrzaj = document.getElementById("SadrzajFavorites");
            sadrzaj.innerHTML = "";
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
          
        }
    });
});

});

}


function UzmiChaptere()
{

    const Kolekcija = db.collection("KorisnikKnjigaCitanje");

    const q = Kolekcija.where("IdKorisnika","==","/Korisnik/"+KorisnikId).get().then(querySnapshot  => {
    
    querySnapshot.forEach(element => {
        var KnjigaId =element.data().IdKnjige;
        var BrojStrane =  element.data().Strana;
        const Kolekcija2 = db.collection("Knjiga")
        const Dokument = Kolekcija2.doc(KnjigaId.substring(8));
        Dokument.get().then(result =>{
            if (result.exists) {
                var IdKnjige = result.id;
                var Naziv = result.data().Naziv;
                console.log(BrojStrane);
                const KOlekcija3 = db.collection("Strana"); 

                const q2 = KOlekcija3.where("IdKnjige","==","/Knjiga/"+IdKnjige).where("BrojStrane","==",BrojStrane).get().then(resultat2=>{
                    var Id = resultat2.docs[0].id;
                    var url = "strana.html" + '?strana=' + Id + '&knjiga=' + IdKnjige;
                    var kontejner = document.getElementById("SadrzajNastavi");
                    kontejner.innerHTML= "";
                    kontejner.innerHTML +=
                        "<a href='" + url + "'><div class='Chapter'>" +
                        "<h3>" +  Naziv + "</h3>" +
                        "<h3>" +  resultat2.docs[0].data().BrojStrane + "</h3>" +
                        "</div></a>";

                });
              
            }
        });
    });
    
    });

}

