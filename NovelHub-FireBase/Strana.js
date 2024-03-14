import { firebaseApp, auth, db } from './FirebaseConfig.js';
var BrojStrane = 0;
var StranaId = "";
var KnjigaId = "";
var params;
var nizPreseka = ['.', '?', '!'];
var KorisnikId = "";
function UcitajSTranu() {
    const KOlekcija = db.collection('Strana');
    params = new URLSearchParams(window.location.search);
    StranaId = params.get('strana');
    KOlekcija.doc(StranaId).get().then(result => {
        BrojStrane = result.data().BrojStrane;
        document.getElementById("Naziv").innerHTML = result.data().NazivStrane + " /Chapter number : " + result.data().BrojStrane;
        UcitajSadrzaj();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        UzmiKOrisnika() ;
    }
    else
    {
        var KorisnikId = "";
    }

});



function UzmiKOrisnika()
{   

    const Kolekcija = db.collection("Korisnik");
    const q = Kolekcija.where("Email", "==", firebase.auth().currentUser.email).get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            KorisnikId = querySnapshot.docs[0].id;
            DodajZacitanje();
        }
    }).catch(error => {
        console.error("Greška pri pristupu kolekciji:", error);
    });
}
function DodajZacitanje() {
    var user = firebase.auth().currentUser;
    const Kolekcija = db.collection("KorisnikKnjigaCitanje");

    if (user) {
        const q = Kolekcija.where("IdKorisnika", "==", "/Korisnik/" + KorisnikId)
                           .where("IdKnjige", "==", "/Knjiga/" + KnjigaId)
                           .get()
                           .then(querySnapshot => {
                               if (!querySnapshot.empty) {
                                   const docRef = querySnapshot.docs[0].ref;
                                   docRef.update({
                                       Strana: BrojStrane
                                   }).then(() => {
                                       console.log("Uspješno ažurirana strana.");
                                   }).catch(error => {
                                       console.error("Greška prilikom ažuriranja dokumenta:", error);
                                   });
                               }
                               else//ako nema pise novu knjigu
                               {
                                const q2 = Kolekcija.add({
                                    IdKnjige : "/Knjiga/" + KnjigaId,
                                    IdKorisnika : "/Korisnik/" + KorisnikId,
                                    Strana: BrojStrane,
                                });
                               }
                           })
                           .catch(error => {
                               console.error("Greška pri pristupu kolekciji KorisnikKnjigaCitanje:", error);
                           });
    }

}

function PrepraviTekst() {
    var tekst = document.getElementById("Tekst").innerHTML;
    var teskt2 = "";
    for (var i = 0; i < tekst.length; i++) {
        teskt2 += tekst[i]
        if (nizPreseka.includes(tekst[i]))
            teskt2 += "<br>";
    }
    document.getElementById("Tekst").innerHTML = teskt2;
}

function UcitajSadrzaj() {
    const KOlekcija = db.collection('StranaSadrzaj');
    const q = KOlekcija.where("StranaId", "==", "/Strana/" + StranaId).get().then(result => {
        document.getElementById("Tekst").innerHTML = result.docs[0].data().Sadrzaj;
        PrepraviTekst();
        UpdejtujPregledeKnjige()
        DugmeSledec();
        DugmePredhodno();
        UzmiKOrisnika();
    });
}

function UpdejtujPregledeKnjige() {
    KnjigaId = params.get('knjiga');
    const KOlekcija = db.collection('Knjiga');
    KOlekcija.doc(KnjigaId).update({
        Pregledi: firebase.firestore.FieldValue.increment(1)

    });
}

function DugmeSledec() {
    const KOlekcija = db.collection('Strana');
    const q = KOlekcija.where("IdKnjige", "==", "/Knjiga/" + KnjigaId).where("BrojStrane", ">", BrojStrane).limit(1).get().then(result => {
        if (!result.empty) {
            var element = document.getElementById("Sledece");
            element.style.opacity = "1";
            element.href = "Strana.html" + "?strana=" + result.docs[0].id + "&knjiga=" + KnjigaId;
        }
    });
}

function DugmePredhodno() {
    const KOlekcija = db.collection('Strana');
    const q = KOlekcija.where("IdKnjige", "==", "/Knjiga/" + KnjigaId).where("BrojStrane", "<", BrojStrane).limit(1).get().then(result => {
        if (!result.empty) {
            var element = document.getElementById("Predhodno");
            element.style.opacity = "1";
            element.href = "Strana.html" + "?strana=" + result.docs[0].id + "&knjiga=" + KnjigaId;
        }
    });
}
window.addEventListener("load", () => {
    UcitajSTranu();
});