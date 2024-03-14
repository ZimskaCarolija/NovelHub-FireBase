import { firebaseApp, auth, db } from './FirebaseConfig.js';
import { Knjiga } from './UcitavanjeKnjiga.js';

let knjiga;
let Sacuvano = false;
let knjigaId = "";
let KorisnikId = "";
function UcitajProsledjenu() {
    var params = new URLSearchParams(window.location.search);
     knjigaId = params.get('knjiga');
    const Kolekcija = db.collection("Knjiga");
    const Dokument = Kolekcija.doc(knjigaId);
    Dokument.get().then(doc => {
        if (doc.exists) {
            knjiga = new Knjiga(doc.id, doc.data().IdAutora, doc.data().Naziv, doc.data().Opis, doc.data().Pregledi, doc.data().Slika, doc.data().Zanr);
            //popunjavanje stavki dizajna
            document.getElementById("Naziv").innerHTML = knjiga.naziv;
            document.getElementById("Pregledi").innerHTML = "Views : " + knjiga.pregledi;
            document.getElementById("OpisKOntejner").innerHTML = knjiga.opis;
            document.getElementById("Slika").src = "Slike/" + knjiga.slika;
            const zanroviKOlekcija = document.getElementById("Zanrovi");
            zanroviKOlekcija.innerHTML = "";
            knjiga.zanr.forEach(z => {
                zanroviKOlekcija.innerHTML += "<div class='Zanr'>" + z + "</div>";
            });

            UcitajAutora();
            PopuniChaptere();
            UzmiKOrisnika();
        }

    });
}
function UzmiKOrisnika()
{   
    const Kolekcija = db.collection("Korisnik");
    const q = Kolekcija.where("Email", "==", firebase.auth().currentUser.email).get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            KorisnikId = querySnapshot.docs[0].id;
            ProveriDaliJeSacuvana();
        }
    }).catch(error => {
        console.error("Greška pri pristupu kolekciji:", error);
    });
}
function ProveriDaliJeSacuvana()
{   
    const Kolekcija2 = db.collection('KorisnikFavorite');
    console.log("/Korisnik/"+KorisnikId);
    console.log("/Knjiga/"+knjigaId);
    const q2 = Kolekcija2.where("IdKorisnika", "==", "/Korisnik/"+KorisnikId).where("IdKnjige","==","/Knjiga/"+knjigaId).get().then(querySnapshot => {
        if (!querySnapshot.empty)
        {         
            document.getElementById("Sacuvaj").innerHTML = "Saved";
            console.log("Sacuvano je");
            Sacuvano = true;
        }
    });
    Sacuvano = false;
}

function UcitajAutora() {
    debugger;
    if (knjiga != undefined) {
        console.log(knjiga);
        const Kolekcija = db.collection("Korisnik");
        const Dokument = Kolekcija.doc(knjiga.autorid.substring(10));//klanjamo /Korisnik/
        Dokument.get().then(doc => {
            document.getElementById("Autor").innerHTML = "Autor : " + doc.data().Naziv;
            debugger;
        });
    }
}

function PopuniChaptere() {
    var params = new URLSearchParams(window.location.search);
    var knjigaId = params.get('knjiga');
    const Kolekcija = db.collection("Strana");
    const q = Kolekcija.where("IdKnjige", "==", "/Knjiga/" + knjiga.id).orderBy('BrojStrane').get().then(result => {
        const kontejner = document.getElementById("ChapteriKOntejner");
        kontejner.innerHTML = "";
        result.forEach(r => {
            var Id = r.id;
            var url = "strana.html" + '?strana=' + Id + '&knjiga=' + knjigaId;
            kontejner.innerHTML +=
                "<a href='" + url + "'><div class='Chapter'>" +
                "<h3>" + r.data().NazivStrane + "</h3>" +
                "<h3>" + r.data().BrojStrane + "</h3>" +
                "</div></a>";

        });

    });

}
function Sacuvaj()
{
        var user = firebase.auth().currentUser;
        const Kolekcija2 = db.collection("KorisnikFavorite");
    if (user) {
      UzmiKOrisnika();
        if(Sacuvano)
        {
            Kolekcija2.where("IdKorisnika", "==", "/Korisnik/" + KorisnikId)
            .where("IdKnjige", "==", "/Knjiga/" +  knjigaId)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.delete().then(() => {
                    document.getElementById("Sacuvaj").innerHTML = "Save";
                }).catch(error => {
                  console.error("Greška prilikom brisanja dokumenta:", error);
                });
              });
            })
            .catch(error => {
              console.error("Greška pri pristupu kolekciji KorisnikFavorite:", error);
            });

        }
        else
        {
            Kolekcija2.add({
                IdKnjige : "/Knjiga/"+knjigaId,
                IdKorisnika : "/Korisnik/"+KorisnikId
            }).then(docref =>{
                document.getElementById("Sacuvaj").innerHTML = "Saved";
            });
        }

    } else {
      alert("To save you need yo be logged in");
    }
    
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        UzmiKOrisnika()
    }
    else
    {
        KorisnikId = "";
        Sacuvano = false;
        document.getElementById("Sacuvaj").innerHTML = "Save";
    }
});

document.getElementById("Sacuvaj").addEventListener("click",Sacuvaj);
window.addEventListener("load", () => {
    UcitajProsledjenu();
});