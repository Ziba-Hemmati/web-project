// Foundations of Information Retrieval and Web Search Project

const fs = require("fs");
const path = require("path");
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  add(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}
function processHTMLFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  const wordLists = [];
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const cleanedContent = fileContent.replace(/<[^>]+>/g, ""); // Remove HTML tags
    const words = cleanedContent.replace(/[^\w\s]/gi, "").split(/\s+/); // Remove punctuation marks
    const wordList = new LinkedList();
    for (const word of words) {
      if (word.trim() !== "") {
        wordList.add(word);
      }
    }
    wordLists.push(wordList);
  }
  return wordLists;
}
const htmlDirPath = "./html-files";
const wordLists = processHTMLFiles(htmlDirPath);
// Inverse index
const inverseIndex = new Map();
for (let i = 0; i < wordLists.length; i++) {
  const wordList = wordLists[i];
  const words = wordList.toArray();
  for (const word of words) {
    if (!inverseIndex.has(word)) {
      inverseIndex.set(word, [i]);
    } else {
      const documentIndices = inverseIndex.get(word);
      if (!documentIndices.includes(i)) {
        documentIndices.push(i);
      }
    }
  }
}
console.log("Inverse index:", inverseIndex);
// Position index
const positionIndex = new Map();
for (let i = 0; i < wordLists.length; i++) {
  const wordList = wordLists[i];
  const words = wordList.toArray();
  for (let j = 0; j < words.length; j++) {
    const word = words[j];
    if (!positionIndex.has(word)) {
      positionIndex.set(word, []);
    }
    positionIndex.get(word).push({ documentIndex: i, position: j });
  }
}
console.log("Position index:", positionIndex);
// Compare sizes
console.log("Inverse index size:", inverseIndex.size);
console.log("Position index size:", positionIndex.size);