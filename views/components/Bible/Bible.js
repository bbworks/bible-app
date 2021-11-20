import * as bibleApi from "/js/bible-api.js";

bibleApi.getBibleByBibleId("06125adad2d5898a-01")
  .then(data=>{
    console.log(data);
    return bibleApi.getBooksByBibleId();
  })
  .then(data=>{
    console.log(data);
    return bibleApi.getChaptersByBookId("JHN");
  })
  .then(data=>{
    console.log(data);
    return bibleApi.getVersesByChapterId("JHN.1");
  })
  .then(data=>{
    console.log(data);
    return bibleApi.getVerseByVerseId("JHN.1.1");
  })
  .then(data=>{
    return console.log(data);
  });
