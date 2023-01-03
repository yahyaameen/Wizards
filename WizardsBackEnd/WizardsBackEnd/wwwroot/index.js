var isUserExist;
var userId;
document.addEventListener('DOMContentLoaded', async function() {
    var signUp = document.querySelector("#signup");
    signUp.addEventListener('click', async function(e) {
        isUserExist = false;
        e.preventDefault();
        var userName = document.querySelector("#username").value;
        var pass = document.querySelector("#password").value;
        var userRole = document.querySelector("#role").value;
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
        await userExist(userName);
        if (isUserExist) {
            alert("this Username is exist");
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
            var data = {
                name: userName.trim(),
                password: pass.trim(),
                role: userRole.trim()
            };
            await fetch('https://localhost:7211/api/UserDetails', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                  })
                  .then(response => response.json())
                  .then(data => {
                    userId = data.id;
                    console.log('Success:', data);
                  })
                 .catch((error) => {
                    console.error('Error:', error);
                 });
            if (userRole === "Regular User") {
                localStorage.setItem('userId', userId);
                window.location = 'regularUser.html';
            } else {
                localStorage.setItem('userId', userId);
                window.location = 'wizardCreator.html';
            }
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

    async function userExist(userName) {

        await fetch('https://localhost:7211/api/UserDetails')
            .then(data => {
                return data.json();
            })
            .then(users => {
                checkUserExist(users, userName);
            });
    }

    function checkUserExist(users, name) {
        for (let i = 0; i < users.length; i++) {
            var user = users[i];
            if (user.name === name) {
                isUserExist = true;
            }
        }
    }

});