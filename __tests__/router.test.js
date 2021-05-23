/**
 * @jest-environment jsdom
 */

import { pushToHistory } from '../scripts/router.js'

describe('router', () => {
    test('pushes settings to history stack', () => {
        let initHistoryLength = history.length;
        let newHistory = pushToHistory('settings', 0);
        expect(newHistory.length).toBe(initHistoryLength+1);
        expect(newHistory.state).toStrictEqual({"page": "settings"});
    });

    test('pushes random entry to history stack', () => {
        let randomEntryNumber = Math.floor(Math.random() * 101);
        let initHistoryLength = history.length;
        let newHistory = pushToHistory('entry', randomEntryNumber);
        expect(newHistory.length).toBe(initHistoryLength+1);
        expect(newHistory.state).toStrictEqual({"page": `entry${randomEntryNumber}`});
    });
    
    test('pushes empty state to history stack', () => {
        let initHistoryLength = history.length;
        let newHistory = pushToHistory('', 0);
        expect(newHistory.length).toBe(initHistoryLength+1);
        expect(newHistory.state).toStrictEqual({});
    });
});