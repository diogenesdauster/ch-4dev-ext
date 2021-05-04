chrome.runtime.onInstalled.addListener(() => {
  let persons = [];
  chrome.storage.sync.set({ persons });
  console.log(`Init Array of persons`);
});
