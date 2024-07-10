import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

class PipelineSingleton {

    static task = 'text-classification';
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance = null;

    static getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    let classifier = await PipelineSingleton.getInstance(x => {
        self.postMessage(x);
    });

    let output = await classifier(event.data.text);

    self.postMessage({
        status: 'complete',
        output: output,
    });
});