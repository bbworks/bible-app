import * as bibleApi from "/js/api/bible.js";


//Initialize variables
const bibleVersionSelect = document.querySelector(".bible-version-select");
const bibleBookSelect = document.querySelector(".bible-book-select");
const bibleChapterSelect = document.querySelector(".bible-chapter-select");
const bibleScripture = document.querySelector(".bible-scripture");

//Initialize defaults
const DEFAULT_BIBLE_REFERENCE = {
  version: "06125adad2d5898a-01",
  book: "JHN",
  chapter: "JHN.1",
};

const BIBLE_REFERENCE = {
  version: null,
  book: null,
  chapter: null,
}

//Create utility functions
const clearChildren = parent=>{
  [...parent.children].forEach(child=>parent.removeChild(child));
};

//Create functions
const renderBibleVersions = (bibleVersions, DOMNode)=>{
  //Clear the select
  clearChildren(bibleVersionSelect);

  //Add each option
  Object.entries(
    bibleVersions
      .reduce((obj, version)=>(
        obj[version.language.name] ?
        obj[version.language.name].push(version) && obj :
        {
          ...obj,
          [version.language.name]: ["────────────────", version.language.name.toUpperCase(), version],
        }
      ), {})
    )
    .sort(([aLanguage, aBibleVersion],[bLanguage, bBibleVersion])=>(aLanguage < bLanguage ? -1 : (bLanguage < aLanguage ? 1 : 0)))
    .sort(([aLanguage, aBibleVersion],[bLanguage, bBibleVersion])=>(aLanguage==="English" ? -1 : 0))
    .map(([language, bibleVersion])=>bibleVersion)
    .flat()
    .forEach((bibleVersion, i)=>{
      if (i===0) return;
      const bibleVersionOption = document.createElement("option");
      if (typeof bibleVersion === "string") {
        bibleVersionOption.disabled = true;
        bibleVersionOption.innerText = bibleVersion;
      }
      else {
        bibleVersionOption.classList.add("bible-version-option");
        bibleVersionOption.setAttribute("data-bible-version-abbreviation", bibleVersion.abbreviation);
        bibleVersionOption.setAttribute("data-bible-version-id", bibleVersion.id);
        bibleVersionOption.setAttribute("data-bible-version-name", bibleVersion.name);
        bibleVersionOption.value = bibleVersion.id;
        bibleVersionOption.innerText = bibleVersion.name
      }
      bibleVersionSelect.appendChild(bibleVersionOption);
    });
};

const renderBibleBooks = (bibleBooks, DOMNode)=>{
  //Clear the select
  clearChildren(bibleBookSelect);

  //Add each option
  bibleBooks.forEach(bibleBook=>{
    const bibleBookOption = document.createElement("option");
    bibleBookOption.classList.add("bible-book-option");
    bibleBookOption.setAttribute("data-bible-book-bible-id", bibleBook.bibleId);
    bibleBookOption.setAttribute("data-bible-book-id", bibleBook.id);
    bibleBookOption.setAttribute("data-bible-book-name", bibleBook.name);
    bibleBookOption.value = bibleBook.id;
    bibleBookOption.innerText = bibleBook.name
    bibleBookSelect.appendChild(bibleBookOption);
  });
};

const renderBibleChapters = (bibleChapters, DOMNode)=>{
  //Clear the select
  clearChildren(bibleChapterSelect);

  //Add each option
  bibleChapters.forEach(bibleChapter=>{
    const bibleChapterOption = document.createElement("option");
    bibleChapterOption.classList.add("bible-chapter-option");
    bibleChapterOption.setAttribute("data-bible-chapter-bible-id", bibleChapter.bibleId);
    bibleChapterOption.setAttribute("data-bible-chapter-book-id", bibleChapter.bookId);
    bibleChapterOption.setAttribute("data-bible-chapter-id", bibleChapter.id);
    bibleChapterOption.setAttribute("data-bible-chapter-name", bibleChapter.reference);
    bibleChapterOption.value = bibleChapter.id;
    bibleChapterOption.innerText = bibleChapter.number
    bibleChapterSelect.appendChild(bibleChapterOption);
  });
};

const renderBiblePassage = (bibleChapter, DOMNode)=>{
  //Initialize variables
  const bibleReference = bibleScripture.querySelector(".bible-reference");
  const biblePassage = bibleScripture.querySelector(".bible-passage");

  //Deconstruct the data
  const {content, reference} = bibleChapter;

  //Render the data to the UI
  bibleReference.innerText = reference;
  biblePassage.innerHTML = content;
};

const setBibleVersion = async (versionId, DOMNode, DOMNode2)=>{
  //Fetch the bible version & books data
  const bibleVersion = await bibleApi.getBibleByBibleId(versionId); //Just to set the shadow bible id
  const bibleBooks = await bibleApi.getBooksByBibleId();

  //Set the model data
  BIBLE_REFERENCE.version = versionId;

  //If the UI's selected version doesn't match, fix that
  bibleVersionSelect.value = versionId;

  //Render the bible version's books to the UI
  renderBibleBooks(bibleBooks, bibleBookSelect);

  //If the current book & chapter are available in this version, reset them,
  // otherwise, grab the first one
  const book = bibleBooks.find(book=>book.id === BIBLE_REFERENCE.book ?? DEFAULT_BIBLE_REFERENCE.book);
  if (book)
    await setBibleBook(book.id);
  else
    await setBibleBook(bibleBooks[0].id);
};

const setBibleBook = async (bookId, DOMNode, DOMNode2)=>{
  //Fetch the bible book's chapters' data
  const bibleChapters = await bibleApi.getChaptersByBookId(bookId);

  //Set the model data
  BIBLE_REFERENCE.book = bookId;

  //If the UI's selected book doesn't match, fix that
  bibleBookSelect.value = bookId;

  //Render the bible book's chapters to the UI
  renderBibleChapters(bibleChapters, bibleChapterSelect);

  //If the current book is available, set it,
  // otherwise, grab the first one
  const chapter = bibleChapters.find(chapter=>chapter.id === (BIBLE_REFERENCE.chapter || DEFAULT_BIBLE_REFERENCE.chapter))
  if (chapter)
    await setBibleChapter(chapter.id);
  else
    await setBibleChapter(bibleChapters[0].id);
};

const setBibleChapter = async (chapterId, DOMNode, DOMNode2)=>{
  //Fetch the bible chapter's data
  const bibleChapter = await bibleApi.getChapterByChapterId(chapterId, null, {"include-chapter-numbers": true, "include-verse-spans": true});

  //Start by resetting the book reference, in case it has changed
  if (BIBLE_REFERENCE.book !== bibleChapter.bookId)
    await setBibleBook(bibleChapter.bookId);

  //Set the model data
  BIBLE_REFERENCE.chapter = chapterId;

  //If the UI's selected chapter doesn't match, fix that
  bibleChapterSelect.value = chapterId;

  //Render the bible chapter's content to the UI
  renderBiblePassage(bibleChapter, bibleScripture);
};


//Create event listeners
const onBibleVersionSelectInput = async event=>{
  setBibleVersion(event.target.value);
};

const onBibleBookSelectInput = async event=>{
  setBibleBook(event.target.value);
};

const onBibleChapterSelectInput = async event=>{
  setBibleChapter(event.target.value);
};


const initializeBible = async ()=>{
  //Start by initially fetching the available bible versions
  const bibleVersions = await bibleApi.getBibles()

  //Render the bible version to the UI
  renderBibleVersions(bibleVersions, bibleVersionSelect);

  //Set the default bible reference
  setBibleVersion(DEFAULT_BIBLE_REFERENCE.version, bibleVersionSelect, bibleBookSelect)
    .then(()=>setBibleBook(DEFAULT_BIBLE_REFERENCE.book, bibleBookSelect, bibleChapterSelect))
    .then(()=>setBibleChapter(DEFAULT_BIBLE_REFERENCE.chapter, bibleChapterSelect, bibleScripture));

  //Attach event listeners
  bibleVersionSelect.addEventListener("input", onBibleVersionSelectInput);
  bibleBookSelect.addEventListener("input", onBibleBookSelectInput);
  bibleChapterSelect.addEventListener("input", onBibleChapterSelectInput);
};


//Start the bible
initializeBible();
