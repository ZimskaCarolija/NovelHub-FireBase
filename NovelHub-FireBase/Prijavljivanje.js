import { firebaseApp, auth, db } from './FirebaseConfig.js';

var Prijavljen = false;


function PrijavljenFJa()
{
    var korisnikTemp = localStorage.getItem("Korisnik");
    if(korisnikTemp == "" || korisnikTemp == null)
    {
    Prijavljen = false;
    }
    else
    {
        Prijavljen = true;
    }
    PromeniPrijavniDugme();
}

function DodajKOrisnika() {
    const username = document.getElementById('Sigmuser').value
    db.collection('Korisnik').add({
            Email: auth.currentUser.email,
            Naziv: username,
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            Prijavljen = true;
            Izadji();
            PromeniPrijavniDugme(true);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

function Izadji() {
    const Prijavi = document.getElementById("Prijavi");
    Prijavi.innerHTML = "";
    Prijavi.style.display = 'none'
}

function PromeniPrijavniDugme() {
    var LogIn = document.getElementById("LogIn");
    var SignUpP = document.getElementById("SignUp");
    var LogOut = document.getElementById("LogOut");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            LogIn.style.display = 'none';
            SignUpP.style.display = 'none';
            LogOut.style.display = 'inline';
        } else {
            auth.signOut();
            console.log(localStorage.getItem("Korisnik"));
            LogIn.style.display = 'inline';
            SignUpP.style.display = 'inline';
            LogOut.style.display = 'none';
        }
      });
   /* if (Prijavljen == true) {
        console.log(localStorage.getItem("Korisnik"));
        LogIn.style.display = 'none';
        SignUpP.style.display = 'none';
        LogOut.style.display = 'inline';
    } else {
        localStorage.setItem("Korisnik", null);
        auth.signOut();
        console.log(localStorage.getItem("Korisnik"));
        LogIn.style.display = 'inline';
        SignUpP.style.display = 'inline';
        LogOut.style.display = 'none';
    }*/
}

function Logout() {
    Prijavljen = false;
    auth.signOut()
        .then(() => {
            console.log("Korisnik je izlogovan.");
            localStorage.setItem("Korisnik", null);
            
        })
        .catch((error) => {
            console.log("Greška pri izlogovanju:", error);
        });
        PromeniPrijavniDugme();

}
//funckije za Stavke Prijalvjivanja
function SignUp() {
    const Prijavi = document.getElementById("Prijavi");
    Prijavi.style.display = 'flex'
    Prijavi.innerHTML =
        "<h4>Sign Up</h4>" +
        "<div><label>E-mail :</label><input type='email' id='SignEmail' /></div>" +
        "<div><label>Password :</label><input type='password' id='SignPass' /></div>" +
        "<div><label>Username</label><input type='text' id='Sigmuser' /></div>" +
        "<div><button class='Dugme' id='NapraviNalogBtn''>Sign up</button><button class='Dugme' id='Izadji'>Exit</button></div>";

    const napraviNalogBtn = document.getElementById("NapraviNalogBtn");
    napraviNalogBtn.addEventListener("click", NapraviNalog);
    const IzadjigBtn = document.getElementById("Izadji");
    IzadjigBtn.addEventListener("click", Izadji);
}

function NapraviNalog() {
    const email = document.getElementById('SignEmail').value
    const password = document.getElementById('SignPass').value

    auth.createUserWithEmailAndPassword(email, password)
        .then((res) => {
            console.log(res.user);
            DodajKOrisnika();
            localStorage.setItem("Korisnik", auth.currentUser.email);
        })
        .catch((err) => {
            alert(err.message)
            console.log(err.code)
            console.log(err.message)
        })
}

function UlogujSe() {
    const email = document.getElementById('SignEmail').value
    const password = document.getElementById('SignPass').value
    auth.signInWithEmailAndPassword(email, password)
        .then((res) => {
            console.log(res.user);
            Prijavljen = true;
            localStorage.setItem("Korisnik", auth.currentUser.email);
            PromeniPrijavniDugme();
            Izadji();
        })
        .catch((err) => {
            alert(err.message)
            console.log(err.code)
            console.log(err.message)
        })
}

function LogIn() {
    const Prijavi = document.getElementById("Prijavi");
    Prijavi.style.display = 'flex'
    Prijavi.innerHTML =
        "<h4>Log in</h4>" +
        "<div><label>E-mail :</label><input type='email' id='SignEmail' /></div>" +
        "<div><label>Password :</label><input type='password' id='SignPass' /></div>" +
        "<div><button class='Dugme' id='UlogujSeDugme''>Log in</button><button class='Dugme' id='Izadji'>Exit</button></div>";

    const UlogujSeDugme = document.getElementById("UlogujSeDugme");
    UlogujSeDugme.addEventListener("click", UlogujSe);
    const IzadjigBtn = document.getElementById("Izadji");
    IzadjigBtn.addEventListener("click", Izadji);
}
//dinamicki dodavanje 
const signUpLink = document.getElementById("SignUp");
signUpLink.addEventListener("click", SignUp);
const LogoutLink = document.getElementById("LogOut");
LogoutLink.addEventListener("click", Logout);
const LogInLink = document.getElementById("LogIn");
LogInLink.addEventListener("click", LogIn);
window.addEventListener("load",PrijavljenFJa);