const extensionId = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;

export const sendMessageToExtension = async (data) => {
  if (
    extensionId &&
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    chrome.runtime.sendMessage
  ) {
    chrome.runtime.sendMessage(extensionId, { data }, (response) => {
      console.log("Response:", response);
    });
  } else {
    console.log("Screenshot was not sent to the extension.");
  }
};
