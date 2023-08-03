# Home Bookmark
Is a Chrome's extension makes new tab page with all your Favouirate Bookmarks
& A tool that help you get Favicon with colorful background as same as favicon main color automaticly

## features
1. Popup (click Icon on browser's toolbar)
    - Get Title, Current Page URL, FavIcon and FavIcon main color
    - Change the Title, URL and Category before bookmarking it or Store it
    - Add/Remove bookmark (when popup windows still open!)
    - Change card's background
    - Font size in card changed automaticly by the length of title and trimmed on the 35th letter
    - Check if current tab's url is dublicated in bookmark
    - "Check URL" found similars bookmark from current domain , and ability to remove bookmark by click (X)
2. "New Tab" UI
    - Generating boomarks categories and fill evey category with Stored data on `chrome.storage.local` 
    - Stored data contain (URL,Ttitle,Favicon URL, Color, CategoryID, CategoryTitle, Font size)

## Install

1. Download the latest version [home-bookmark](https://github.com/Ahmedhkad/home-bookmark/releases) `zip` file and unzip it

2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer Mode** by clicking the toggle switch next to `Developer mode`
4. Click the `LOAD UNPACKED` button and select the unzip directory

---
### Screenshot of the new (New tab)

![Screenshot of new tab](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-newtab.JPG)
---
### Screenshot of popup (add bookmark)
![Screenshot popup](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-newtab-popup.JPG)

### click (Check URL) and Bookmark it
First colors row was getted automaticly from favicon,
Clicking "Check URL" shows similar bookmarks that contaons same domain

![click (Check URL) and Bookmark it](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-google-popup.JPG)

## Work in progress
- Still can't delete bookmark from UI or change title , color etc
- Store and Bookmark could be done togther 
- Store it button save it to chrome.storage.local soon will be in storage.sync and option to some database
- card had only one style, but i'm works to add 4 card's style (Big wide, small wide, big icon and small icon)
