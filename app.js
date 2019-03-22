"use specsStrict";

const samsungPhonesURLs = 'https://brosbg.com/gsm-magazin/date/all/filter&br=[13]&pp=80';

let phonesArr = [];
let id = 1;

require('isomorphic-fetch');

fetch(samsungPhonesURLs)
  .then((response) => {
    return response.text();
  })
  .then((html) => {
    require('./dom-parser')(html);
    const singlePhoneUrlArr = Array.from($(".product-image")).slice(2, ).map(obj => obj.href);
    return Promise.resolve(singlePhoneUrlArr);
  })
  .then((singlePhoneUrlArr) => {
    for (let index = 0; index < singlePhoneUrlArr.length; index++) {
      const link = singlePhoneUrlArr[index];
      const phoneObj = {
        model: "",
        image: "",
        description: "",
        timesLiked: 0,
        id: id
      };

      const timeOut = ((Math.floor(Math.random() * (3 - 1 + 1)) + 1) + index) * 1000;
      const waiting = `${index} of ${singlePhoneUrlArr.length}`;
      setTimeout(() => {
        fetch(link)
          .then((response) => {
            return response.text();
          })
          .then((html) => {
            require('./dom-parser')(html);

            phoneObj.model = $('h1 > strong')[0].innerHTML;
            phoneObj.image = $('.cloud-zoom')[0].src;

            const descriptionObj = {};
            const specsAnchorTagArr = Array.from($('.desc-table-left')).slice(5, 67).map(obj => obj.innerHTML);
            const infoAnchorTagArr = Array.from($('.desc-table-left').next()).slice(4, 66).map(obj => obj.innerHTML)
            for (let i = 0; i < specsAnchorTagArr.length; i++) {
              let specsStr = specsAnchorTagArr[i].trim();
              let infoStr = infoAnchorTagArr[i].trim();
              if (specsStr !== 'Производител') {
                if (infoStr.includes('icon-plus')) infoStr = '+';
                if (infoStr.includes('icon-minus')) infoStr = '-';
                descriptionObj[specsStr] = infoStr;
              }
            }

            phoneObj.description = descriptionObj;
            phonesArr.push(phoneObj);
            return Promise.resolve();
          })
          .then(() => {
            console.log(waiting);
            if (index === singlePhoneUrlArr.length - 1) {
              phonesArr = phonesArr.sort((a, b) => a.id - b.id);
              // paste logged phonesArr in pasteJSONhere.js to align the array
              console.log(JSON.stringify(phonesArr));
            }
          })
      }, timeOut);

      id++;
    }
  });