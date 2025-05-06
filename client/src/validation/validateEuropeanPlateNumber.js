export const validateEuropeanPlateNumber = (value) => {
  const finnishPlateRegex = /^[A-ZÄÖÅ]{2,3}-[0-9]{1,3}$/;
  const swedishPlateRegex = /^[A-Z]{3}[0-9]{2}[0-9A-Z]{1}$/;
  const estonianPlateRegex = /^[0-9]{3}\s?[A-Z]{3}$|^[A-Z]{2}\s?[0-9]{3}$/;

  return (
    !finnishPlateRegex.test(value) &&
    !swedishPlateRegex.test(value) &&
    !estonianPlateRegex.test(value) &&
    value.length >= 5
  );
};
