$(function () {
    var submitBtn = $("#submitForm");
    submitBtn.onsubmit = function validateForm() {
        // Validate Name
        var name = $("#fullName").value;
        if (name == "" || name == null) {
        } else {
            alert("Please enter only alphanumeric values for your advertisement title");
        }

        // Validate Email
        var email = $("#email").val();
        if ((/(.+)@(.+){2,}\.(.+){2,}/.test(email)) || email == "" || email == null) {
        } else {
            alert("Please enter a valid email");
        }
        return false;
    }
});