import QRCode from "qrcode";

const options = { type: "svg", margin: 2, width: 320, color: { dark: "#11192aff", light: "#ffffffff" }, errorCorrectionLevel: "H" };
await Promise.all([
  QRCode.toFile("public/qr-instagram.svg", "https://www.instagram.com/aws.sbg.uvv/", options),
  QRCode.toFile("public/qr-meetup.svg", "https://www.meetup.com/aws-sbg-at-university-vila-velha/", options),
]);
console.log("QR codes sociais gerados.");
