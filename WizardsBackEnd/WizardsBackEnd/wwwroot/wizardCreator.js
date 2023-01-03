document.addEventListener('DOMContentLoaded', async function() {
    var create = document.querySelector("#create");
    var updateOrDelete = document.querySelector("#updateOrDelete");
    create.addEventListener('click', function(e) {
        e.preventDefault();
        window.location = 'create.html';

    });
    updateOrDelete.addEventListener('click', function(e) {
        e.preventDefault();
        window.location = 'showOrDelete.html';

    });
});