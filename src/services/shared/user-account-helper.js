function getRandomBackgroundColor() {
  const availableColors = ["#4769b3", "#32a852", "#eb4034", "#63cbd6"];
  const arrayLength = availableColors.length;
  const randomIndex = Math.floor(Math.random() * Math.floor(arrayLength));
  return availableColors[randomIndex];
}

// this function can be used to generate a profile picture for users which have not set an profile picture
export function getProfilePictureWithInitials(username) {
  const firstLetterOfForename = username.charAt(0);
  const lastNameIndex = username.lastIndexOf(" ");
  let firstLetterOfLastname = "";
  if (lastNameIndex !== -1) {
    firstLetterOfLastname = username.charAt(lastNameIndex + 1);
  }

  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  context.canvas.width = 200;
  context.canvas.height = 200;

  context.fillStyle = getRandomBackgroundColor();
  context.fillRect(0, 0, 300, 300);

  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = "50px Arial";
  context.fillStyle = "white";
  context.fillText(firstLetterOfForename + firstLetterOfLastname, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL("image/webp", 1);
}
