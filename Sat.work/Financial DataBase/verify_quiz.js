const fs = require('fs');

const quizContent = fs.readFileSync('c:/TamKang/livesite/Sat.work/Financial DataBase/quiz.js', 'utf8');

const start = quizContent.indexOf('const questions = [');
const end = quizContent.indexOf('];', start);
const questionsStr = quizContent.substring(start, end + 2);
const questions = eval(questionsStr.replace('const questions = ', ''));

let errorCount = 0;
questions.forEach((q, index) => {
    if (!q.options.includes(q.answer)) {
        console.log
        (`Error in question ${index + 1}:
             Answer "${q.answer}" not found in options.`);
        console.log(`Options: ${JSON.stringify(q.options)}`);
        errorCount++;
    }
});

if (errorCount === 0) {
    console.log("All questions have valid answers.");
} else {
    console.log(`Found ${errorCount} errors.`);
}
