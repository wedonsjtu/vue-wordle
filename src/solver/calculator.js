import { LetterState } from "../types"

export function calcRemainPossibility(board) {
    let lastWord = "";
    let correctChar = ["", "", "", "", ""];
    let presentChar = new Map();
    let charMaxNum = new Map();
    let charMinNum = new Map();
    for (let i in board) {
        i = parseInt(i);
        const word = board.at(i);
        if (!word[0].letter) {
            break;
        }
        lastWord = "";
        let localCharNum = new Map();
        let charAbsent = new Set();
        for (let j in word) {
            j = parseInt(j);
            const char = word[j].letter.toUpperCase();
            lastWord = lastWord + char;
            if (!localCharNum.has(char)) {
                localCharNum.set(char, 0);
            }
            const state = word[j].state;
            if (state == LetterState.CORRECT) {
                correctChar[j] = char;
                localCharNum.set(char, localCharNum.get(char) + 1);
            }
            else if (state == LetterState.PRESENT) {
                if (!presentChar.has(char)) {
                    presentChar.set(char, new Set());
                }
                presentChar.get(char).add(j);
                localCharNum.set(char, localCharNum.get(char) + 1);
            }
            else if (state == LetterState.ABSENT) {
                charAbsent.add(char);
            }
        }
        for (const ch of charAbsent.keys()) {
            charMaxNum.set(ch, localCharNum.get(ch));
        }
        for (const ch of localCharNum.keys()) {
            if (localCharNum.get(ch) == 0) {
                continue;
            }
            if (charMinNum.has(ch) && charMinNum.get(ch) >= localCharNum.get(ch)) {
                continue;
            }
            charMinNum.set(ch, localCharNum.get(ch));
        }
    }
    // console.log("correctChar", correctChar);
    // console.log("presentChar", presentChar);
    // console.log("charMaxNum", charMaxNum);
    // console.log("charMinNum", charMinNum);
    // console.log("==========");

    let appearChar = new Set();
    let possChar = new Set();
    for (const ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        if (charMinNum.has(ch) && charMinNum.get(ch) > 0) {
            appearChar.add(ch);
            possChar.add(ch);
        }
        if (!charMaxNum.has(ch) || (charMaxNum.get(ch) > 0)) {
            possChar.add(ch);
        }
    }
    let appearWithUnknownChar = new Set();
    for (const ch of appearChar.keys()) {
        appearWithUnknownChar.add(ch);
    }
    if (possChar.size > appearChar.size) {
        appearWithUnknownChar.add("~");
    }
    // console.log("appearChar", appearChar);
    // console.log("possChar", possChar);
    // console.log("appearWithUnknownChar", appearWithUnknownChar);
    // console.log("==========");

    console.info("Last word:", lastWord);

    // let bruteForceNumber = bruteForce(possChar, correctChar, presentChar, charMaxNum, charMinNum);
    // console.info("Brute force solution number:", bruteForceNumber);
    let bruteForceTypeNumber = bruteForce(appearWithUnknownChar, correctChar, presentChar, charMaxNum, charMinNum);
    console.info("Brute force type number:", bruteForceTypeNumber);
    // console.info("Brute force solution number:", bruteForceNumber, "; type:", bruteForceTypeNumber);

    const unknownCharNum = possChar.size - appearChar.size;
    let backtrackingAnswerList = [];
    const backtrackingSolNumber = backtracking([...correctChar], 0, correctChar, presentChar, charMaxNum, charMinNum, unknownCharNum, backtrackingAnswerList);
    console.info("Backtracking solution number:", backtrackingSolNumber);
    console.log("Backtracking answer list:", backtrackingAnswerList);
    console.log("==========");
    return;
}

function backtracking(tmpArray, i, correctChar, presentChar, charMaxNum, charMinNum, unknownCharNum, answerList) {
    // tmp array: ["~", "a", "e", "~", "~"]
    if (i == 5) {
        let charNum = new Map();
        for (const ch of tmpArray) {
            if (!charNum.has(ch)) {
                charNum.set(ch, 0);
            }
            charNum.set(ch, charNum.get(ch) + 1);
        }
        for (const [ch, times] of charMinNum) {
            if (times == 0) continue;
            if (!charNum.has(ch) || charNum.get(ch) < times) {
                return 0;
            }
        }
        for (const [ch, times] of charMaxNum) {
            if (charNum.has(ch) && charNum.get(ch) > times) {
                return 0;
            }
        }

        let ans = 1;
        for (const ch of tmpArray) {
            if (ch == "~") {
                ans *= unknownCharNum;
            }
        }
        if (answerList !== undefined) {
            answerList.push(tmpArray.join(""));
        }
        return ans;
    }

    if (correctChar[i]) {
        return backtracking(tmpArray, i + 1, correctChar, presentChar, charMaxNum, charMinNum, unknownCharNum, answerList);
    }
    else {
        let ans = 0;
        for (const ch of charMinNum.keys()) {
            if (charMinNum.get(ch) == 0) {
                continue;
            }
            if (presentChar.has(ch) && presentChar.get(ch).has(i)) {
                continue;
            }
            tmpArray[i] = ch;
            ans += backtracking(tmpArray, i + 1, correctChar, presentChar, charMaxNum, charMinNum, unknownCharNum, answerList);
            tmpArray[i] = "";
        }
        tmpArray[i] = "~";
        ans += backtracking(tmpArray, i + 1, correctChar, presentChar, charMaxNum, charMinNum, unknownCharNum, answerList);
        tmpArray[i] = "";
        return ans;
    }
}

function bruteForce(possChar, correctChar, presentChar, charMaxNum, charMinNum) {
    let ans = 0;
    let ansList = [];
    for (const ch1 of possChar)
    for (const ch2 of possChar)
    for (const ch3 of possChar)
    for (const ch4 of possChar)
    for (const ch5 of possChar) {
        let flag = false;
        const tmpArray = [ch1, ch2, ch3, ch4, ch5];

        // check legal
        let charNum = new Map();
        for (const ch of tmpArray) {
            if (!charNum.has(ch)) {
                charNum.set(ch, 0);
            }
            charNum.set(ch, charNum.get(ch) + 1);
        }
        for (const [ch, times] of charMinNum) {
            if (times == 0) continue;
            if (!charNum.has(ch) || charNum.get(ch) < times) {
                flag = true;
                break;
            }
        }
        if (flag) continue;
        for (const [ch, times] of charMaxNum) {
            if (charNum.has(ch) && charNum.get(ch) > times) {
                flag = true;
                break;
            }
        }
        if (flag) continue;

        for (const i of [0, 1, 2, 3, 4]) {
            if (correctChar[i] != "" && correctChar[i] != tmpArray[i]) {
                flag = true;
                break;
            }
        }
        if (flag) continue;

        for (const ch of presentChar.keys()) {
            if (!tmpArray.includes(ch)) {  // don't appear
                flag = true;
                break;
            }
            let set = presentChar.get(ch);
            for (const i of set) {  // appear in wrong place
                if (tmpArray[i] == ch) {
                    flag = true;
                    break;
                }
            }
            if (flag) break;
        }
        if (flag) continue;

        ans += 1;
        ansList.push(tmpArray.join(""));
    }
    // console.log(ansList);
    return ans;
}
