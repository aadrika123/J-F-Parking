export function customInputValidation(
  e,

  inputValidation
) {
  if (inputValidation.includes("mobile")) {
    const value = e.target.value;

    if (value.length > 10) {
      e.target.value = value.slice(0, 10);
    }
  }

  if (inputValidation.includes("zip")) {
    const value = e.target.value;

    if (value.length > 6) {
      e.target.value = value.slice(0, 6);
    }
  }

  if (inputValidation.includes("aadhar")) {
    const value = e.target.value;

    if (value.length > 12) {
      e.target.value = value.slice(0, 12);
    }
  }

  if (inputValidation.includes("removeDoubleSpace")) {
    const value = e.target.value;

    e.target.value = value.replace(/\s+/g, " ");
  }

  if (inputValidation.includes("removeSpecialCharacter")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z0-9]/g, "");
  }

  if (inputValidation.includes("removeSpecialCharacterExceptSpace")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z0-9 ]/g, "");
  }

  if (inputValidation.includes("removeSpecialCharacterExceptSpaceAndDot")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z0-9 .]/g, "");
  }

  if (inputValidation.includes("sqlInjectionGuard")) {
    const value = e.target.value;

    if (value.includes("drop") || value.includes("select")) {
      e.target.value = "";
    }
  }

  if (inputValidation.includes("address")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z0-9 ,]/g, "");
  }

  if (inputValidation.includes("phone")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^0-9]/g, "");
  }

  if (inputValidation.includes("email")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z0-9@.]/g, "");
  }

  if (inputValidation.includes("string")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z ]/g, "");
  }

  if (inputValidation.includes("number")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^0-9]/g, "");
  }

  if (inputValidation.includes("removeDoubleQuote")) {
    const value = e.target.value;

    e.target.value = value.replace(/"/g, "");
  }

  if (inputValidation.includes("removeSingleQuote")) {
    const value = e.target.value;

    e.target.value = value.replace(/'/g, "");
  }

  if (inputValidation.includes("removeSpecialCharacterWithDoubleSpace")) {
    const value = e.target.value;

    e.target.value = value.replace(/[^a-zA-Z0-9 ]/g, "");

    const newValue = e.target.value;

    e.target.value = newValue.replace(/\s+/g, " ");
  }

  if (inputValidation.includes("CapitalFirstLetter")) {
    const value = e.target.value;

    e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
  }

  if (inputValidation.includes("UppercaseAfterSpace")) {
    const value = e.target.value;

    e.target.value = value

      .split(" ")

      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

      .join(" ");
  }

  if (inputValidation.includes("Uppercase")) {
    const value = e.target.value;

    e.target.value = value.toUpperCase();
  }

  if (inputValidation.includes("removeSpace")) {
    const value = e.target.value;

    e.target.value = value.replace(/\s+/g, "");
  }

  if (inputValidation.includes("Lowercase")) {
    const value = e.target.value;

    e.target.value = value.toLowerCase();
  }

  if (inputValidation.includes("none")) {
    const value = e.target.value;

    e.target.value = value;
  }

  // decimal

  if (inputValidation.includes("decimal")) {
    const value = e.target.value;

    // Allow only numbers and one decimal point

    let cleanedValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points

    const parts = cleanedValue.split(".");

    if (parts.length > 2) {
      cleanedValue = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places

    if (parts.length === 2 && parts[1].length > 2) {
      cleanedValue = parts[0] + "." + parts[1].slice(0, 2);
    }

    e.target.value = cleanedValue;
  }
}
