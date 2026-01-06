
/* =====================================================
   GENEL YARDIMCI FONKSİYONLAR
===================================================== */

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function setUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getActiveUser() {
    return JSON.parse(localStorage.getItem("activeUser"));
}

function setActiveUser(user) {
    localStorage.setItem("activeUser", JSON.stringify(user));
}

function getPoems() {
    return JSON.parse(localStorage.getItem("poems")) || [];
}

function setPoems(poems) {
    localStorage.setItem("poems", JSON.stringify(poems));
}

const DEFAULT_AVATAR = "./images/avatar.png";

/* =====================================================
   REGISTER
===================================================== */
function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔴 Mail kontrolü
    const mailUsed = users.find(u => u.email === email);
    if (mailUsed) {
        alert("Bu e-posta adresi zaten kullanılıyor!");
        return;
    }

    const newUser = {
        username,
        email,
        password,
        avatar: "images/avatar.png"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    window.location.href = "login.html";
}



/* =====================================================
   LOGIN
===================================================== */
function login() {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;

    const users = getUsers();
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        alert("Kullanıcı adı veya şifre hatalı.");
        return;
    }

    setActiveUser(user);
    window.location.href = "index.html";
}


/* =====================================================
   LOGOUT
===================================================== */
function logout() {
    localStorage.removeItem("activeUser");
    window.location.href = "index.html";
}


/* =====================================================
   INDEX INIT
===================================================== */
function initIndex() {
    const user = getActiveUser();

    if (user) {
        document.getElementById("userArea").classList.remove("d-none");
        document.getElementById("guestArea").classList.add("d-none");

        document.getElementById("navUsername").innerText = user.username;
        document.getElementById("navAvatar").src = user.avatar;

    }

    loadPoems();
    loadLatestPoems();
}


/* =====================================================
   ŞİİR PAYLAŞ
===================================================== */
function addPoem() {
    const user = getActiveUser();

    if (!user) {
        alert("Şiir paylaşmak için üye olmanız gerekir.");
        return;
    }

    const title = document.getElementById("poemTitle").value.trim();
    const poemAuthor = document.getElementById("poemAuthor").value.trim();
    const content = document.getElementById("poemText").value.trim();

    if (!title || !poemAuthor || !content) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    const poems = getPoems();

    poems.unshift({
        title,
        poemAuthor,
        content,
        sharedBy: user.username,
        avatar: user.avatar,
        likes: 0,
        liked: false
    });

    setPoems(poems);

    document.getElementById("poemTitle").value = "";
    document.getElementById("poemAuthor").value = "";
    document.getElementById("poemText").value = "";

    loadPoems();
    loadLatestPoems();
}


/* =====================================================
   ANA AKIŞ ŞİİRLER
===================================================== */
function loadPoems() {
    const poems = getPoems();
    const poemsDiv = document.getElementById("poemsDiv");
    if (!poemsDiv) return;

    poemsDiv.innerHTML = "";

    poems.forEach((p, i) => {
        poemsDiv.innerHTML += `
        <div class="card p-3 mb-3">
            <div class="d-flex align-items-center mb-2">
                <img src="${p.avatar}" class="avatar me-2">
                <strong>${p.sharedBy}</strong>
            </div>

            <h5>${p.title}</h5>
            <small class="text-muted">✍️ ${p.poemAuthor}</small>

            <p class="mt-2">${p.content}</p>

            <span class="like-btn ${p.liked ? 'liked' : ''}"
                  onclick="likePoem(${i})">
                ${p.liked ? "❤️" : "🤍"}
            </span>
            <span>${p.likes}</span>
        </div>
        `;
    });
}


/* =====================================================
   BEĞEN
===================================================== */
function likePoem(index) {
    const user = getActiveUser();
    if (!user) {
        alert("Beğenmek için giriş yapmalısınız.");
        return;
    }

    const poems = getPoems();
    poems[index].liked = !poems[index].liked;
    poems[index].likes += poems[index].liked ? 1 : -1;

    setPoems(poems);
    loadPoems();
}


/* =====================================================
   SAĞ PANEL - SON ŞİİRLER
===================================================== */
function loadLatestPoems() {
    const poems = getPoems();
    const latestPoems = document.getElementById("latestPoems");
    if (!latestPoems) return;

    latestPoems.innerHTML = "";

    poems.slice(0, 5).forEach(p => {
        latestPoems.innerHTML += `
        <li class="list-group-item">
            <strong>${p.title}</strong><br>
            <small>${p.poemAuthor}</small>
        </li>
        `;
    });
}

/* =====================================================
   PROFİL AYARLARI
===================================================== */

function loadProfile() {
    const user = getActiveUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("profileUsername").innerText = user.username;
    document.getElementById("profileAvatar").src = user.avatar;

    const poems = getPoems();
    const userPoems = poems.filter(p => p.sharedBy === user.username);

    const userPoemsDiv = document.getElementById("userPoems");
    userPoemsDiv.innerHTML = "";

    if (userPoems.length === 0) {
        userPoemsDiv.innerHTML = "<p>Henüz şiir paylaşmadın.</p>";
        return;
    }

    userPoems.forEach(p => {
        userPoemsDiv.innerHTML += `
        <div class="card p-3 mb-3">
            <h5>${p.title}</h5>
            <small class="text-muted">✍️ ${p.poemAuthor}</small>
            <p class="mt-2">${p.content}</p>
        </div>
        `;
    });
}
/* =====================================================
   ABOUT AYARLARI
===================================================== */

function initNavbar() {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (!user) return;

    document.getElementById("navUsername").innerText = user.username;
    document.getElementById("navAvatar").src = user.avatar;
}

function sendMessage(e) {
    e.preventDefault();
    alert("Mesajınız alınmıştır. Teşekkür ederiz!");
}

function sendMessage(event) {
    event.preventDefault();

    const successText = document.getElementById("formSuccess");
    successText.style.display = "block";

    event.target.reset();
}
