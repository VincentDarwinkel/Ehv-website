import { toast } from "react-toastify";

function getUserFriendlyMessage(statusCode) {
  const messages = {
    304: "Niet aangepast, de aanvraag is niet uitgevoerd",
    401: "Niet gemachtigd, de server heeft uw aanvraag niet geaccepteerd",
    404: "Het aangevraagde item kon niet worden gevonden",
    429: "Teveel aanvragen per seconden",
    500: "Er is iets fout gegaan op de server, probeer het later opnieuw",
    undefined: "Server niet bereikbaar, probeer het later opnieuw",
  };
  return messages[statusCode];
}

// this function displays a user friendly error message based on the http status code
export default function handleErrorMessages(fetchResult, ignoredStatusCodes = []) {
  if (ignoredStatusCodes.includes(fetchResult.status)) {
    return;
  }
  if (!fetchResult?.ok) {
    const key = fetchResult.status;
    toast.error(getUserFriendlyMessage(key));
  }
}
