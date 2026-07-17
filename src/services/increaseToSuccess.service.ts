//<a-steps :current="current" :items="items" :percent="count" />

var count = 0;
var intervalId: NodeJS.Timeout;

function setCount(value: number) {
    count = value;
}

function increaseToSuccess(apiPromise: Promise<any>): Promise<any[]> {
    const promise = new Promise((resolve) => {
        intervalId = setInterval(() => {
            count++;

            if (count >= 90) {
                clearInterval(intervalId);
                resolve(count);
            }
        }, 20); // mỗi 20ms tăng 1
    });

    return Promise.all([apiPromise, promise]);
}

const resetLoading = () => {
    count = 0;
    clearInterval(intervalId);
};

export default {
    count,
    increaseToSuccess,
    resetLoading,
    setCount,
}