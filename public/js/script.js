(() => {
  "use strict"; // Enables strict mode to catch common JS errors

  // Fetch all forms in the DOM that need Bootstrap validation
  const forms = document.querySelectorAll(".needs-validation");

  // Convert NodeList to an array and loop through each form
  Array.from(forms).forEach((form) => {
    // Add a submit event listener to each form
    form.addEventListener(
      "submit",
      (event) => {
        // If form fields are invalid, prevent submission
        if (!form.checkValidity()) {
          event.preventDefault();    // Stop form from submitting
          event.stopPropagation();  // Stop event from bubbling up
        }

        // Add Bootstrap's 'was-validated' class to trigger visual feedback
        form.classList.add("was-validated");
      },
      false // Third parameter: useCapture — false means bubbling phase
    );
  });
})();


    
