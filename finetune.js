require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function uploadFile() {
    try {
        const f = await openai.createFile(
            fs.createReadStream("newdata_prepared.jsonl"),
            "fine-tune"
        );
        console.log(`File ID ${f.data.id}`);
        return f.data.id;
    }
    catch (err) {
        console.log('err uploadfile: ', err);
    } 
}
// uploadFile();
//File ID file-Cs2nKHNkqR4homp7YpIieV93

async function makeFineTune() {
    try {
        const ft = await openai.createFineTune({
            training_file: 'file-Cs2nKHNkqR4homp7YpIieV93',
            model: 'davinci'
        });
        console.log(ft.data);
     }
    catch (err) {
        console.log('err makefinetune: ', err.response.data.error);
    }
}
// makeFineTune();

async function getFineTunedModelName() {
    try {
        const modelName = await openai.listFineTunes();
        console.table(modelName.data.data, ["id", "status", "fine_tuned_model"]);
    }
    catch (err) {
        console.log('err getmod: ', err)
    }
 }
getFineTunedModelName();

async function run() {
    try {
        const comp = await openai.createCompletion({
            model: 'YOUR-FINETUNED-MODEL-NAME',
            prompt: `Qual seu nome e o da sua empresa?`,
            max_tokens: 200
        });
        if (comp.data) {
            console.log('choices: ', comp.data.choices)
        }
    } catch (err) {
        console.log('err: ', err)
    }
}
// run();