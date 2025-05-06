export const validateFinnishPhoneNumber = (value) => {
  const finnishPhoneRegex =
    /^((04[0-9]{1})(\s?|-?)|050(\s?|-?)|0457(\s?|-?)|[+]?358(\s?|-?)50|0358(\s?|-?)50|00358(\s?|-?)50|[+]?358(\s?|-?)4[0-9]{1}|0358(\s?|-?)4[0-9]{1}|00358(\s?|-?)4[0-9]{1})(\s?|-?)(([0-9]{3,4})(\s|-)?[0-9]{1,4})$/;
  return !finnishPhoneRegex.test(value) && value.length >= 10;
};
