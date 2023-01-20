// ==UserScript==
// @name         Decline-Google-Cookies
// @namespace    http://tampermonkey.net/
// @source       https://github.com/kakka0903/decline-google-cookies
// @version      0.3
// @description  Auto-decline google consent cookies. More on github.
// @author       Kasper J. Hopen Alfarnes
// @match        https://consent.google.com/*
// @match        https://*.google.com/*
// @match        https://google.com/*
// @match        https://consent.youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=chrome.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    function localeString (locale, toConvert) {
        const strings = {de:{customise:"weiter", reject:"ablehnen"},
                         en:{customise:"customi", reject:"reject"},
                         it:{customise:"personaliz", reject:"rifiut"},
                         es:{customise:"opcion", reject:"rechaz"}}; 
         return strings[locale][toConvert];
    }

    function isHidden (element) {
        /* check if elmement is hidden in the dom */
        return element.offsetParent === null;
    }

    function isButton (element) {
        /* check if element is a button */
        return element.tagName == "BUTTON";
    }

    function hasTextInChild (element, text) {
        var children = element.childNodes;

        // loop through all child elements
        for (var i = 0; i < children.length; i++) {
            var found_text = children[i].textContent;
            console.log('Decline-Google-Cookies: function hasTextInChild. found_text: '+found_text+', text: '+text)

            found_text = found_text.toLowerCase();
            text = text.toLowerCase();

            // check text
            if (found_text.indexOf(text) >= 0)
                return true;
        }
        return false;
    }

    function main () {
        var currentLocale = 'en';
        var all_buttons = [...document.getElementsByTagName("button")];

         // first find locale
        for (var i = 0; i < all_buttons.length; i++) {
          var element = all_buttons[i];

          var buttonText = element.textContent;
          // console.log('Decline-Google-Cookies: buttonText is: '+buttonText);
          if (buttonText.length < 2) {
              all_buttons.splice(i, 1); 
              break;
          }
          if (buttonText.length == 2 || buttonText == 'Deutsch' || buttonText == 'Italiano' || buttonText == 'Español') {
              if (buttonText == 'Deutsch')
                currentLocale = 'de';
              else if (buttonText == 'Italiano')
                 currentLocale = 'it';
              else if (buttonText == 'Español')
                 currentLocale = 'es';
              else
                currentLocale = buttonText;
              console.log('Decline-Google-Cookies: locale is: '+currentLocale);
              all_buttons.splice(i, 1); 
              break;
          }
        }

        // then, click confirm button
        for (var i = 0; i < all_buttons.length; i++) {
          var element = all_buttons[i];
          var buttonText = element.textContent;
          // click them if not hidden and says "Reject"
          if (!isHidden(element) && hasTextInChild(element, localeString(currentLocale, "reject")))
            element.click();
        }
    }

    setTimeout(() => {
        console.log("Decline-Google-Cookies: Running tampermonkey script");
        main();
    }, 1000);
})();
