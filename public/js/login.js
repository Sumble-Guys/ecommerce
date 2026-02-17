const form = document.querySelector("form");
eField = form.querySelector(".email"),
  eInput = eField.querySelector("input"),
  pField = form.querySelector(".password"),
  pInput = pField.querySelector("input");
  const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

  form.onsubmit = (e) => {
    // Perform form validation
    let isValid = true;
  
    if (eInput.value === "") {
      eField.classList.add("shake", "error");
      isValid = false;
      let errorTxt = eField.querySelector(".error-txt");
      errorTxt.innerText = "Email can't be blank";
    } else {
      let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      if (!eInput.value.match(pattern)) {
        eField.classList.add("shake", "error");
        isValid = false;
        let errorTxt = eField.querySelector(".error-txt");
        errorTxt.innerText = "Enter a valid email address";
      } else {
        eField.classList.remove("error");
        eField.classList.add("valid");
      }
    }
  
    if (pInput.value === "") {
      pField.classList.add("shake", "error");
      isValid = false;
    } else {
      pField.classList.remove("error");
      pField.classList.add("valid");
    }
  
    if (!isValid) {
      e.preventDefault(); // Prevent the form from submitting if validation fails
      setTimeout(() => {
        eField.classList.remove("shake");
        pField.classList.remove("shake");
      }, 500);
    }
  };
  