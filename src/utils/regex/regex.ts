export const namePattern = /^[a-zA-Z0-9_.-]{1,20}$/;
export const nameRegex = new RegExp(namePattern);
export const passwordPattern =
  /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const passwordRegex = new RegExp(passwordPattern);
