
// オセロ実装参考
// https://techacademy.jp/magazine/22767


import { useEffect } from "react";
import "./stage.css";

const nameArea = document.getElementsByClassName("name");

const stoneStateList = [];
var currentColor = 1;
var collectState = true;

const onClickSquare = (index) => {
  //ひっくり返せる石の数を取得
  const reversibleStones = getReversibleStones(index);

  //他の石があるか、置いたときにひっくり返せる石がない場合は置けないメッセージを出す
  if (stoneStateList[index] !== 0 || !reversibleStones.length) {
    alert("ここには置けないよ！");
    collectState = false;
    return;
  }

  //自分の石を置く 
  stoneStateList[index] = currentColor;
  document
    .querySelector(`[data-index='${index}']`)
    .setAttribute("data-state", currentColor);

  //相手の石をひっくり返す = stoneStateListおよびHTML要素の状態を現在のターンの色に変更する
  reversibleStones.forEach((key) => {
    stoneStateList[key] = currentColor;
    document.querySelector(`[data-index='${key}']`).setAttribute("data-state", currentColor);
  });

  //もし盤面がいっぱいだったら、集計してゲームを終了する
  if (stoneStateList.every((state) => state !== 0)) {
    const blackStonesNum = stoneStateList.filter(state => state === 1).length;
    const whiteStonesNum = 64 - blackStonesNum;

    let winnerText = "";
    if (blackStonesNum > whiteStonesNum) {
      winnerText = "黒の勝ちです！";
    } else if (blackStonesNum < whiteStonesNum) {
      winnerText = "白の勝ちです！";
    } else {
      winnerText = "引き分けです";
    }

    alert(`ゲーム終了です。白${whiteStonesNum}、黒${blackStonesNum}で、${winnerText}`)
  }

  changeColor();
}

const getReversibleStones = (idx) => {
  //クリックしたマスから見て、各方向にマスがいくつあるかをあらかじめ計算する
  //squareNumsの定義はやや複雑なので、理解せずコピーアンドペーストでも構いません
  const squareNums = [
    7 - (idx % 8),
    Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
    (56 + (idx % 8) - idx) / 8,
    Math.min(idx % 8, (56 + (idx % 8) - idx) / 8),
    idx % 8,
    Math.min(idx % 8, (idx - (idx % 8)) / 8),
    (idx - (idx % 8)) / 8,
    Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8),
  ];
  //for文ループの規則を定めるためのパラメータ定義
  const parameters = [1, 9, 8, 7, -1, -9, -8, -7];

  //ここから下のロジックはやや入念に読み込みましょう
  //ひっくり返せることが確定した石の情報を入れる配列
  let results = [];

  //8方向への走査のためのfor文
  for (let i = 0; i < 8; i++) {
    //ひっくり返せる可能性のある石の情報を入れる配列
    const box = [];
    //現在調べている方向にいくつマスがあるか
    const squareNum = squareNums[i];
    const param = parameters[i];
    //ひとつ隣の石の状態
    const nextStoneState = stoneStateList[idx + param];

    //フロー図の[2][3]：隣に石があるか 及び 隣の石が相手の色か -> どちらでもない場合は次のループへ
    if (nextStoneState === 0 || nextStoneState === currentColor) continue;
    //隣の石の番号を仮ボックスに格納
    box.push(idx + param);

    //フロー図[4][5]のループを実装
    for (let j = 0; j < squareNum - 1; j++) {
      const targetIdx = idx + param * 2 + param * j;
      const targetColor = stoneStateList[targetIdx];
      //フロー図の[4]：さらに隣に石があるか -> なければ次のループへ
      if (targetColor === 0) continue;
      //フロー図の[5]：さらに隣にある石が相手の色か
      if (targetColor === currentColor) {
        //自分の色なら仮ボックスの石がひっくり返せることが確定
        results = results.concat(box);
        break;
      } else {
        //相手の色なら仮ボックスにその石の番号を格納
        box.push(targetIdx);
      }
    }
  }
  //ひっくり返せると確定した石の番号を戻り値にする
  return results;
};

function changeColor(){
  var color = document.getElementById("current-turn")
  var classList = document.getElementById('stage-area').classList

  //ゲーム続行なら相手のターンにする
  currentColor = 3 - currentColor;

  if (currentColor === 1) {
    if(localStorage.getItem("role") === "黒"){
      color.textContent = "黒(あなた)";
      nameArea[0].style.border = "1px solid red";
      nameArea[1].style.border = "";
      classList.remove('noClick');
    }else{
      color.textContent = "黒(相手)";
      nameArea[0].style.border = "";
      nameArea[1].style.border = "1px solid red";
      classList.add('noClick');
    }
  } else {
    if(localStorage.getItem("role") === "白"){
      color.textContent = "白(あなた)";
      nameArea[0].style.border = "1px solid red";
      nameArea[1].style.border = "";
      classList.remove('noClick');
    }else{
      color.textContent = "白(相手)";
      nameArea[0].style.border = "";
      nameArea[1].style.border = "1px solid red";
      classList.add('noClick');
    }
  }
}

function Stage({handleAdd}) {
  let isCreated = false;

  // useEffect(() => {
  //   createSquares();
  // }, []);

  

  const createSquares = () => {
    if(!isCreated){
      isCreated = true;
      console.log(localStorage.getItem("role"));

      for (let i = 0; i < 64; i++) {
        const square = document.getElementById("square-template").cloneNode(true); //テンプレートから要素をクローン
        square.removeAttribute("id"); //テンプレート用のid属性を削除
        document.getElementById("stage").appendChild(square); //マス目のHTML要素を盤に追加
      
        const stone = square.querySelector('.stone');

        //ここから編集
        let defaultState;
        //iの値によってデフォルトの石の状態を分岐する
        if (i === 27 || i === 36) {
          defaultState = 1;
        } else if (i === 28 || i === 35) {
          defaultState = 2;
        } else {
          defaultState = 0;
        }

        stone.setAttribute("data-state", defaultState);
        stone.setAttribute("data-index", i); //インデックス番号をHTML要素に保持させる
        stoneStateList.push(defaultState); //初期値を配列に格納

        //for文の最後に追記
        square.addEventListener('click', () => {
          onClickSquare(i);
          //ひっくり返せるところに置ければ相手に情報を送る
          if(collectState){
            handleAdd(i);
          }else{
            collectState = true;
          }
        })
      }
    }
    var color = document.getElementById("current-turn")
    if(localStorage.getItem("role") == "黒"){
      color.textContent = "黒(あなた)";
    }else{
      color.textContent = "黒(相手)";
      document.getElementById('stage-area').classList.add('noClick');
    }
  };

  return (
    <div id="stage-area">
      <div id="stage" className="stage"></div>
      <div id="square-template" className="square">
        <div className="stone"></div>
      </div>
      <div id="stage-info">
        <p>現在の手番は<span id="current-turn">---</span>です</p>
        <button onClick={createSquares}>createSquares</button>
        <button id="pass" onClick={changeColor}>パスする</button>
      </div>
    </div>
  )
}

export default Stage;
export {onClickSquare, changeColor};