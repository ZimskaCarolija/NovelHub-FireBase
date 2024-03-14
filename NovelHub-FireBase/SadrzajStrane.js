import { firebaseApp, auth, db } from './FirebaseConfig.js';
let StranaID = "";
var params;
let StranaSadrzajID = "";
function UcitajSTranu()
{
    params = new URLSearchParams(window.location.search);
    StranaID = params.get('strana');
    const Kolekcija = db.collection('StranaSadrzaj');
    const q = Kolekcija.where("StranaId", "==", "/Strana/"+StranaID).get().then(querySnapshot => {
       document.getElementById("Sadrzaj").value = querySnapshot.docs[0].data().Sadrzaj;
       StranaSadrzajID = querySnapshot.docs[0].id;
    });
}
function Sacuvaj()
{
    if(StranaSadrzajID.length<=1)
    {
        alert("Not logged in");
        return;
    }
    const Kolekcija = db.collection('StranaSadrzaj');
    const DOkument = Kolekcija.doc(StranaSadrzajID);
    DOkument.update({
        Sadrzaj : document.getElementById("Sadrzaj").value
    });
    alert("Successfully updated");
}



firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        UcitajSTranu();
    } else {
        auth.signOut();
         StranaSadrzajID = "";
        document.getElementById("Sadrzaj").value = "";
    }
  });

document.getElementById("Sacuvaj").addEventListener("click",Sacuvaj);