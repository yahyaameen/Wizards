document.addEventListener('DOMContentLoaded', async function() {
    var userName;
    var pass;
    var signIn = document.querySelector("#signIn");
    signIn.addEventListener('click', async function(e) {
        e.preventDefault();
        userName = document.querySelector("#username").value;
        pass = document.querySelector("#password").value;
        var invalidName = false;
        var invalidPassword = false;
        if (userName == "") {
            alert("Username is Required");
            invalidName = true;
        }
        if (!nameCheck(userName)) {
            alert("Invalid Username");
            invalidName = true;
        }
        if (pass == "") {
            alert("Password is Required");
            invalidPassword = true;
        }
        if (!passCheck(pass)) {
            alert("Invalid Password");
            invalidPassword = true;
        }
        if (invalidName === false && invalidPassword === false) {

            await fetch('https://localhost:7211/api/UserDetails')
                .then(data => {
                    return data.json();
                })
                .then(json => {
                    userCheck(json);
                });
        }
    });

    function nameCheck(name) {
        var isName = /^(?=.{5,20}$)[a-z A-Z]+$/.test(name);
        return isName;
    }

    function passCheck(pass) {
        var isName = /^(?=.{5,20}$)[a-z A-Z 0-9]+$/.test(pass);
        return isName;
    }

    function userCheck(allUsers) {
        var userisExist = false;
        for (let i = 0; i < allUsers.length; i++) {
            let user = allUsers[i];
            if (user.name === userName) {
                userisExist = true;
                if (user.password === pass) {
                    if (user.role === "Regular User") {
                        localStorage.setItem('userId', user.id);
                        window.location = 'regularUser.html';
                    } else if (user.role === "admin") {
                        window.location = 'admin.html';
                    } else {
                        localStorage.setItem('userId', user.id);
                        window.location = 'wizardCreator.html';
                    }
                } else {
                    alert("Incorrect password");
                }
            }

        }
        if (userisExist === false) {
            alert("Username does not exist");
        }
    }
});