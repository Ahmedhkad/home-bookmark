# Home Bookmark
Chrome extension for a customized new tab page with your favorite bookmarks and automatic favicon background color extraction.

## features
1. **Popup** (click Icon on browser's toolbar)
 - Get Title, Current Page URL, FavIcon and FavIcon main color
 - Change the Title, URL and Category before bookmarking it or Store it
 - Add/Remove bookmark (when popup windows still open!)
 - Change card's background color
 - Font size in card changed automatically by the length of title and trimmed on the 35th letter
 - Check if current tab's url is duplicated in bookmark
 - "Check URL" found similar bookmark from current domain , and ability to remove bookmark by click (X)
2. **"New Tab"** UI
 - Generating bookmarks categories and fill every category with Stored data on `chrome.storage.local` 
 - Stored data contain (URL, Ttitle, Favicon URL, Color, Category ID, CategoryTitle, Font size)
 - Change bookmark's style by click "show options"
 - You can delete bookmark from UI (from chrome.storage.local)

3. **New Feature (v0.5.0):**
   - Ability to drag and drop saved bookmark items on the new tab, enabling organization at the top of the page.
   - Added two new styles: "big icon" resembling Android icons and "small icon" displaying small favicons of saved sites.
   - Enhanced UI with the option to toggle between styles (smallwide, bigwide, bigicon, smallicon) via "show options".

## Install

1. Download the latest version [home-bookmark](https://github.com/Ahmedhkad/home-bookmark/releases) `zip` file and unzip it.

2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer Mode** by clicking the toggle switch next to `Developer mode`
4. Click the `LOAD UNPACKED` button and select the unzip directory.

---
### Screenshot of the new (New tab)

![Screenshot of new tab](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-newtab.JPG)
---
### Screenshot of popup (add bookmark)
![Screenshot popup](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-newtab-popup.JPG)

### click (Check URL) and Bookmark it
First colors row was got automatically from favicon,
Clicking "Check URL" shows similar bookmarks that contains same domain

![click (Check URL) and Bookmark it](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-google-popup.JPG)

### Screenshot of show options in New Tab 
![Screenshot of show options in New Tab](https://github.com/Ahmedhkad/home-bookmark/blob/main/screenshot/v0.4.0/home-bookmark-newtab-show-options.JPG)

## Work in progress
- Store and Bookmark could be done together 
- Store it buttons save it to chrome.storage.local soon will be in storage.sync and option to some database
- improve UI CSS , until now still use css column , maybe i will back to grid or flex box better

## known bugs
- popup sometimes can't catch favicon's color (if favicon is svg format , or from local server sometimes)