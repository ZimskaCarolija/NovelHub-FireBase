import { firebaseApp, auth, db } from './FirebaseConfig.js';
//import { Knjiga } from './UcitavanjeKnjiga.js';
let KorisnikId = "";
let KorisnikEmail = "";
let KnjigaId;
var params;
function PokupiKOrisnika() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            KorisnikEmail = auth.currentUser.email;
            POpuniChaptere();
            UcitajNazivKnjige();
        } else {
            auth.signOut();
            let KontejnerChaptera = document.getElementById("capteri");
KontejnerChaptera.innerHTML = "";
document.getElementById("Naslov").innerHTML = "";
        }
      });


}
function POpuniChaptere()
{
    params = new URLSearchParams(window.location.search);
KnjigaId = params.get('knjiga');
const Kolekcija = db.collection('Strana');
let KontejnerChaptera = document.getElementById("capteri");
KontejnerChaptera.innerHTML = "";

const q = Kolekcija.where("IdKnjige", "==", "/Knjiga/" + KnjigaId).orderBy("BrojStrane").get().then(querySnapshot => {
    querySnapshot.forEach(element => {
        let url2 = element.id;
        const chapterDiv = document.createElement("div");
        chapterDiv.className = "Chapter";
        chapterDiv.innerHTML = "<div class='Osnova'>" +
            "<input type='text' value='" + element.data().NazivStrane + "'> <div><label>Broj strane : </label><input type='number' value='" + element.data().BrojStrane + "'></div>" +
            "</div> <div class='Dugmici'><a class='Dugme sacuvaj-dugme' data-id='" + url2 + "'>Save</a><a class='Dugme' href='Sadrzaj.html?strana=" + url2 + "'>Edit</a><a class='Dugme delete-dugme' data-id='"+url2+"'>Delete</a></div></div>" +
            "</div>";

        KontejnerChaptera.appendChild(chapterDiv);
    });

    KontejnerChaptera.addEventListener("click", function (event) {
        if (event.target.classList.contains("sacuvaj-dugme")) {
            const chapterId = event.target.getAttribute("data-id");
    
            const osnovaDiv = event.target.closest(".Chapter").querySelector(".Osnova");
    
            const nazivStraneInput = osnovaDiv.querySelector("input[type='text']");
            const brojStraneInput = osnovaDiv.querySelector("input[type='number']");
    
            const nazivStraneValue = nazivStraneInput.value;
            const brojStraneValue = brojStraneInput.value;

            SacuvajPromenOsnovne(chapterId, nazivStraneValue, brojStraneValue);
        }
        if(event.target.classList.contains("delete-dugme"))
        {
            const chapterId = event.target.getAttribute("data-id");
            Izbrisi(chapterId);
        }
    });

});
function Izbrisi(Id)
{
const Kolekcija = db.collection("Strana");
const DOkument = Kolekcija.doc(Id);
DOkument.delete();

location.reload();
}
}
function UcitajNazivKnjige()
{
    params = new URLSearchParams(window.location.search);
    KnjigaId = params.get('knjiga');
    const Kolekcija = db.collection('Knjiga');
    const Dokument = Kolekcija.doc(KnjigaId );
    Dokument.get().then(doc => {
        document.getElementById("Naslov").innerHTML = doc.data().Naziv;
    });
}
function DodajChapter()
{
    if(KnjigaId == null && KorisnikEmail == "")
    {
        alert("error");
        return;
    }
    let NaslovV = document.getElementById("NaslovNovi").value;
    let BrojStraneV = document.getElementById("BrStranaNova").value;
    if(Naslov == "")
    {
        alert("Title must not be empty");
        return;
    }
    const Kolekcija = db.collection('Strana');
    Kolekcija.add({
        BrojStrane: BrojStraneV,
        IdKnjige: "/Knjiga/" + KnjigaId,
        NazivStrane: NaslovV
    }).then((docRef) => {
        console.log(docRef);
        const Kolekcija2 = db.collection('StranaSadrzaj');
        let Naslov = "/Strana/"+docRef.id;
        Kolekcija2.add({
            Sadrzaj:" ",
            StranaId : Naslov,
        });


    }).catch((docRef)=>{
        alert("Error");
    });

    document.getElementById("NaslovNovi").value = "";

    PokupiKOrisnika()

}
function SacuvajPromenOsnovne(ChapterID ,NAzivStranePOM, BrojSTrane)
{
    
    const Kolekcija= db.collection('Strana');
    const DOkument = Kolekcija.doc(ChapterID);
    DOkument.update({
        NazivStrane:NAzivStranePOM,
        BrojStrane : BrojSTrane
    }).then(() => {
        alert("Successfully saved");
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });

    location.reload();
}
/*firebase.auth().onAuthStateChanged(User(user));
function User(user)
{
    if (user) {
        KorisnikEmail = auth.currentUser.email;
        const Kolekcija = db.collection('Korisnik');
    
        const q = Kolekcija.where("Email", "==", KorisnikEmail).get().then(querySnapshot => {
            console.log(KorisnikEmail);
            if (!querySnapshot.empty) {
                KorisnikId = querySnapshot.docs[0].id;
                document.getElementById("KOrisnik").innerHTML = querySnapshot.docs[0].data().Naziv;
                console.log(querySnapshot.docs[0].data().Naziv);
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
    }
}*/
PokupiKOrisnika();

document.getElementById("Dodaj").addEventListener("click",DodajChapter);
