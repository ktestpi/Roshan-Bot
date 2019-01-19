const firebase = require('../helpers/firebase')



// console.log(mocksdk)

jest.mock('../helpers/firebase', () => {
    const firebasemock = require('firebase-mock');

    const mockdatabase = new firebasemock.MockFirebase();
    // const mockauth = new firebasemock.MockFirebase();
    const mocksdk = new firebasemock.MockFirebaseSdk(path => {
        return path ? mockdatabase.child(path) : mockdatabase;
    });
    // const firebaseMock = mocksdk.initializeApp(); // can take a path arg to database url
    // optional - expose the mock
    // global.firebase = firebaseMock;

    // return the mock to match your export api
    return mocksdk;
});

const timepromisy = (delay) => new Promise(res => setTimeout(res,delay))

describe('firebase', () => {
    beforeEach(() => {
        // jest.setTimeout(100000);
    })
    test('Test01', (done) => {
        const fakeData = {dota : '123456789'}
        expect.assertions(1)
        return timepromisy(1000).then(() => {
            expect({}).toEqual(fakeData)

        })
        // firebase.database().ref('bot').once('value').then((snap) => {
        //     console.log(snap.val())
        //     expect({}).toEqual(fakeData)
        //     done()
        // })
    })
})