import API_KEY from "/secret/bible-api-creds.js";

const BASE_URL = "https://api.scripture.api.bible/v1";
const DEFAULT_PARTS = {
  bible: null,
  book: null,
  chapter: null,
  verse: null,
};

const fetchUrl = async (resource, options={})=>{
  let url = `${BASE_URL}/${resource}`;

  if (typeof options.query === "object")
    url = url + "?" + Object.entries(options.query)
      .filter(([queryParam, value])=>!([undefined, null].includes(value)))
      .map(([queryParam, value])=>`${encodeURIComponent(queryParam)}=${encodeURIComponent(value)}`)
      .join("&");

  return fetch(url, {
    ...options,
    headers: {
      "api-key": API_KEY,
    }
  })
    .then(response=>response.json())
    .then(response=>response.data);
};

const getBibles = async (optionsParam={})=>{
  const options = {
    "language": false,              //include array of chapter summaries, default false
    "abbreviation": false,          //include array of chapter summaries and an array of sections, default false
    "name": false,                  //include array of chapter summaries and an array of sections, default false
    "ids": false,                   //include array of chapter summaries and an array of sections, default false
    "include-full-details": false,  //include array of chapter summaries and an array of sections, default false
  };

  if (typeof optionsParam === "object") {
    if (optionsParam.language) options.language = optionsParam.language;
    if (optionsParam.abbreviation) options.abbreviation = optionsParam.abbreviation;
    if (optionsParam.name) options.name = optionsParam.name;
    if (optionsParam.ids) options.ids = optionsParam.ids;
    if (optionsParam["include-full-details"]) options["include-full-details"] = optionsParam["include-full-details"];
  }

  return fetchUrl("bibles", {query: options});
};

const getBibleByBibleId = async (bibleId=DEFAULT_PARTS.bible)=>{
  return fetchUrl(`bibles/${bibleId}`)
    .then(response=>{
      DEFAULT_PARTS.bible = bibleId;
      return response;
    });
};

const getBooksByBibleId = async (bibleId=DEFAULT_PARTS.bible, optionsParam={})=>{
  const options = {
    "include-chapters": false,  //include array of chapter summaries, default false
    "include-chapters-and-sections": false,  //include array of chapter summaries and an array of sections, default false
  };

  if (typeof optionsParam === "object") {
    if (optionsParam["include-chapters"]) options["include-chapters"] = optionsParam["include-chapters"];
    if (optionsParam["include-chapters-and-sections"]) options["include-chapters-and-sections"] = optionsParam["include-chapters-and-sections"];
  }

  return fetchUrl(`bibles/${bibleId}/books`, {query: options});
};

const getBookByBookId = async (bookId=DEFAULT_PARTS.book, bibleId=DEFAULT_PARTS.bible, optionsParam={})=>{
  const options = {
    "include-chapters": false,  //include array of chapter summaries, default false
  };

  if (typeof optionsParam === "object") {
    if (optionsParam["include-chapters"]) options["include-chapters"] = optionsParam["include-chapters"];
  }

  return fetchUrl(`bibles/${bibleId}/books/${bookId}`, {query: options})
    .then(response=>{
      DEFAULT_PARTS.book = bookId;
      return response;
    });
};

const getChaptersByBookId = async (bookId=DEFAULT_PARTS.book, bibleId=DEFAULT_PARTS.bible)=>{
  return fetchUrl(`bibles/${bibleId}/books/${bookId}/chapters`);
};

const getChapterByChapterId = async (chapterId=DEFAULT_PARTS.chapter, bibleId=DEFAULT_PARTS.bible, optionsParam={})=>{
  const options = {
    "content-type": "html",            //"html", "json" (beta), "text" (beta), default "html"
    "include-notes": false,            //include footnotes in content, default false
    "include-titles": true,            //include section titles in content, default true
    "include-chapter-numbers": false,  //include chapter numbers in content, default false
    "include-verse-numbers": true,     //include verse numbers in content, default true
    "include-verse-spans": false,      //include spans that wrap verse numbers and verse text for bible content, default false
    "parallels": null,                 //comma delimited list of bibleIds to include
  };

  if (typeof optionsParam === "object") {
    if (optionsParam["content-type"]) options["content-type"] = optionsParam["content-type"];
    if (optionsParam["include-notes"]) options["include-notes"] = optionsParam["include-notes"];
    if (optionsParam["include-titles"]) options["include-titles"] = optionsParam["include-titles"];
    if (optionsParam["include-chapter-numbers"]) options["include-chapter-numbers"] = optionsParam["include-chapter-numbers"];
    if (optionsParam["include-verse-numbers"]) options["include-verse-numbers"] = optionsParam["include-verse-numbers"];
    if (optionsParam["include-verse-spans"]) options["include-verse-spans"] = optionsParam["include-verse-spans"];
    if (optionsParam["parallels"]) options["parallels"] = optionsParam["parallels"];
  }

  return fetchUrl(`bibles/${bibleId}/chapters/${chapterId}`, {query: options})
    .then(response=>{
      DEFAULT_PARTS.chapter = chapterId;
      return response;
    });
};

const getVersesByChapterId = async (chapterId=DEFAULT_PARTS.chapter, bibleId=DEFAULT_PARTS.bible)=>{
  return fetchUrl(`bibles/${bibleId}/chapters/${chapterId}/verses`);
};

const getVerseByVerseId = async (verseId=DEFAULT_PARTS.verse, bibleId=DEFAULT_PARTS.bible, optionsParam={})=>{
  const options = {
    "content-type": "html",            //"html", "json" (beta), "text" (beta), default "html"
    "include-notes": false,            //include footnotes in content, default false
    "include-titles": true,            //include section titles in content, default true
    "include-chapter-numbers": false,  //include chapter numbers in content, default false
    "include-verse-numbers": true,     //include verse numbers in content, default true
    "include-verse-spans": false,      //include spans that wrap verse numbers and verse text for bible content, default false
    "parallels": null,                 //comma delimited list of bibleIds to include
  };

  if (typeof optionsParam === "object") {
    if (optionsParam["content-type"]) options["content-type"] = optionsParam["content-type"];
    if (optionsParam["include-notes"]) options["include-notes"] = optionsParam["include-notes"];
    if (optionsParam["include-titles"]) options["include-titles"] = optionsParam["include-titles"];
    if (optionsParam["include-chapter-numbers"]) options["include-chapter-numbers"] = optionsParam["include-chapter-numbers"];
    if (optionsParam["include-verse-numbers"]) options["include-verse-numbers"] = optionsParam["include-verse-numbers"];
    if (optionsParam["include-verse-spans"]) options["include-verse-spans"] = optionsParam["include-verse-spans"];
    if (optionsParam["parallels"]) options["parallels"] = optionsParam["parallels"];
  }

  return fetchUrl(`bibles/${bibleId}/verses/${verseId}`, {query: options})
    .then(response=>{
      DEFAULT_PARTS.verse = verseId;
      return response;
    });
};

getBibleByBibleId("06125adad2d5898a-01")
  .then(data=>{
    console.log(data);
    return getBooksByBibleId();
  })
  .then(data=>{
    console.log(data);
    return getChaptersByBookId("JHN");
  })
  .then(data=>{
    console.log(data);
    return getVersesByChapterId("JHN.1");
  })
  .then(data=>{
    console.log(data);
    return getVerseByVerseId("JHN.1.1");
  })
  .then(data=>{
    return console.log(data);
  });
