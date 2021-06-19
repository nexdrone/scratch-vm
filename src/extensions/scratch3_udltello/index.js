const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBpZD0iSUQwLjA4NjgyNDQzOTAwMDMzODMyIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ5MTU0NjY2MDY2MTY5NzQsIDAsIDAsIDAuNDkxNTQ2NjYwNjYxNjk3NCwgLTY0LjUsIC03Ny4yNSkiPjxwYXRoIGlkPSJJRDAuNTcyMTQ2MjMwMzc3MjU2OSIgZmlsbD0iI0ZGOTQwMCIgc3Ryb2tlPSJub25lIiBkPSJNIDE4OCAxNDEgTCAyNTAgMTQxIEwgMjUwIDIwMyBMIDE4OCAyMDMgTCAxODggMTQxIFogIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI4NzkwMzMwODg2ODQwODIsIDAsIDAsIDEuMjg3OTAzMzA4ODY4NDA4MiwgLTExMC45LCAtMjQuNCkiLz48cGF0aCBpZD0iSUQwLjYzODMzNjEzNTA3NDQ5NjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTk2IDIwNCBDIDE5NiAyMDQgMTkyLjcwNiAxOTAuMDU4IDE5MyAxODMgQyAxOTMuMDc0IDE4MS4yMzYgMTk1Ljg4NiAxNzguNDU4IDE5NyAxODAgQyAyMDEuNDU1IDE4Ni4xNjggMjAzLjQ0MyAyMDMuNzU0IDIwNiAyMDEgQyAyMDkuMjExIDE5Ny41NDIgMjEwIDE2NiAyMTAgMTY2ICIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTU3LCAxNS44KSIvPjxwYXRoIGlkPSJJRDAuNzU4NzMwMzU2NTgxNTA5MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTSAyMTUgMTY5IEMgMjE1IDE2OSAyMTguMzY3IDE2OS41MzQgMjIwIDE3MCBDIDIyMC43MTYgMTcwLjIwNSAyMjEuMjc4IDE3MC44MTkgMjIyIDE3MSBDIDIyMi42NDYgMTcxLjE2MiAyMjMuMzY4IDE3MC43ODkgMjI0IDE3MSBDIDIyNC40NDcgMTcxLjE0OSAyMjUgMTcyIDIyNSAxNzIgIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAtNTcsIDE1LjgpIi8+PHBhdGggaWQ9IklEMC4yNDM2NzMwNzMxMjc4NjU4IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNIDIyNyAxNTQgQyAyMjcgMTU0IDIxOC41NTUgMTQ3Ljg5MCAyMTcgMTUxIEMgMjEyLjM0NSAxNjAuMzEwIDIxMS4yODkgMTcxLjczMyAyMTMgMTgyIEMgMjEzLjYxMiAxODUuNjcyIDIyMyAxODcgMjIzIDE4NyAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC01NywgMTUuOCkiLz48cGF0aCBpZD0iSUQwLjc5MzkzOTQ4MTk1NTAyMTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMTc1IDIwMC41MDAgQyAxNzUgMjAwLjUwMCAxNjkuODA1IDIyMS45MTMgMTcxIDIyMi43NTAgQyAxNzIuMTk1IDIyMy41ODcgMTc4Ljc5NSAyMDUuMjk1IDE4Mi41MDAgMjA1Ljc1MCBDIDE4NS45MjAgMjA2LjE3MCAxODEuODU5IDIyNC41MDAgMTg1LjI1MCAyMjQuNTAwIEMgMTg5LjIxMyAyMjQuNTAwIDE5Ny4yNTAgMjA1Ljc1MCAxOTcuMjUwIDIwNS43NTAgIi8+PC9nPjwvc3ZnPg==';

const telloNotConnectMessage = 'Telloに接続できません。\n';

/**
 * 計算単位
 *   1: 時間
 *   2: 距離
 */
const calc_unit = 1;

/**
 * コマンドの名称一覧
 */
const upDesc = ['秒 上昇する', 'cm 上昇する'];
const downDesc = ['秒 下降する', 'cm 下降する'];
const leftDesc = ['秒 左に移動する', 'cm 左に移動する'];
const rightDesc = ['秒 右に移動する', 'cm 右に移動する'];
const forwardDesc = ['秒 前進する', 'cm 前進する'];
const backwardDesc = ['秒 後退する', 'cm 後退する'];
const leftturnDesc = ['秒 左旋回する', '度 左旋回する'];
const rightturnDesc = ['秒 右旋回する', '度 右旋回する'];


/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3UdlTello {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'udltello',
            name: 'UDL Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'takeoff',
                    text: '離陸する',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: '着陸する',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'up',
                    text: '[x] ' + upDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: '[x] ' + downDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'leftmove',
                    text: '[x] ' + leftDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'rightmove',
                    text: '[x] ' + rightDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: '[x] ' + forwardDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'backward',
                    text: '[x] ' + backwardDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'leftturn',
                    text: '[x] ' + leftturnDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'rightturn',
                    text: '[x] ' + rightturnDesc[calc_unit - 1],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'test',
                    text: 'テスト',
                    blockType: BlockType.COMMAND
                },
            ],
            menus: {
            }
        };
    }

    /**
     * Common Methods
     */
    /**
     * Write log.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     */
    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    /**
     * 離陸
     * @return {number} - the user agent.
     */
    takeoff () {
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.takeoff().then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 着陸
     * @return {number} - the user agent.
     */
    land () {
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.land().then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 上昇
     */
    up (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.up(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 下降
     */
    down (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.down(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 左移動
     */
    leftmove (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.left(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 右移動
     */
    rightmove (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.right(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 前進
     */
    forward (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.forward(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 後進
     */
    backward (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.backward(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 左旋回
     */
    leftturn (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.leftturn(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    /**
     * 右旋回
     */
    rightturn (args) {
        const x = Cast.toNumber(args.x);
        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.rightturn(x, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    alert(obj.message);
                }
            });
        });
    }

    test () {
        // この呼び出しはOK
        //this._alert("test");

        CefSharp.BindObjectAsync("boundAsync").then((result) =>
        {
            boundAsync.rightturn(1, calc_unit).then((result) =>
            {
                const obj = JSON.parse(result);
                if (!obj.status) {
                    this._alert(obj.message);
                    //alert(obj.message);
                }
            });
        });

    }



    _alert(x) {
        alert(x);
    }
}

module.exports = Scratch3UdlTello;