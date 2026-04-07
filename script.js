let students = JSON.parse(localStorage.getItem("students")) || [];
let lectures = JSON.parse(localStorage.getItem("lectures")) || [];

// Users
const users = [
    { username: "teacher", password: "123", role: "teacher" },
    { username: "student", password: "123", role: "student" }
];

// LOGIN
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    let user = users.find(u =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login!");
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// NAVIGATION
function goToAttendance() {
    window.location.href = "attendance.html";
}

// SAVE DATA
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("lectures", JSON.stringify(lectures));
}

// ADD STUDENT
function addStudent() {
    let name = document.getElementById("name").value;
    if (!name) return;

    let email = prompt("Enter Parent Email:");

    students.push({
        name: name,
        parentEmail: email,
        attendance: {}
    });

    saveData();
    displayStudents();
}

// ADD LECTURE
function addLecture() {
    let lec = document.getElementById("lecture").value;
    if (!lec) return;

    lectures.push(lec);
    saveData();
    displayStudents();
}

// DISPLAY
function displayStudents() {
    let list = document.getElementById("studentList");
    if (!list) return;

    list.innerHTML = "";

    students.forEach((s, i) => {
        let div = document.createElement("div");

        let total = Object.keys(s.attendance).length;
        let present = Object.values(s.attendance).filter(v => v).length;
        let percent = (present / total) * 100 || 0;

        let className = percent < 75 ? "defaulter" : "";

        div.innerHTML = `<span class="${className}">
            ${s.name} (${percent.toFixed(1)}%)
        </span>`;

        lectures.forEach(l => {
            div.innerHTML += `
                <button onclick="mark(${i}, '${l}', true)">P</button>
                <button onclick="mark(${i}, '${l}', false)">A</button>
            `;
        });

        list.appendChild(div);
    });
}

// MARK ATTENDANCE
function mark(i, lec, present) {
    students[i].attendance[lec] = present;

    if (!present) {
        sendEmail(students[i].name, lec, students[i].parentEmail);
    }

    saveData();
    displayStudents();
}

// SHOW DEFAULTERS
function showDefaulters() {
    let list = document.getElementById("defaulters");
    list.innerHTML = "";

    students.forEach(s => {
        let total = Object.keys(s.attendance).length;
        let present = Object.values(s.attendance).filter(v => v).length;
        let percent = (present / total) * 100 || 0;

        if (percent < 75) {
            list.innerHTML += `<li>${s.name} - ${percent.toFixed(1)}%</li>`;
        }
    });
}

// EMAIL FUNCTION
function sendEmail(name, lecture, email) {
    if (!email) return;

    let params = {
        to_email: email,
        message: `${name} was absent for ${lecture}`
    };

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
        .then(() => alert("Email sent!"))
        .catch(err => console.log(err));
}

// AUTO LOAD
displayStudents();