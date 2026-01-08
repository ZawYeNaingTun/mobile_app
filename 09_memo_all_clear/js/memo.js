"use strict";

//ページ本体が読み込まれたタイミングで実行するコード
window.addEventListener("DOMContentLoaded",
    function(){

        // 1.localStorage使えるか確認
        if(typeof localStorage === "underfined") {
            window.alert("このブラウザはLocal Storage機能が実装されていません");
            return;
        } else {
            viewStorage();                  //logicalStorageからのデータ取得とテーブルへ表示
            saveLocalStorage();             //2.localStorageへの保存
            delLocalStorage();              //3.logicalStorageから1件削除
            allClearLocalStorage();         //4. localstorageからすべて削除
            selectTable();                  //5.データ選択
        }

    },false
);

//2.localStorageへの保存
function saveLocalStorage(){
    const save = document.getElementById("save");
    save.addEventListener("click",
        function(e) {
            e.preventDefault();
            const key = document.getElementById("textKey").value;
            const value = document.getElementById("textMemo").value;

            //値の入力チェック
            if (key =="" || value=="") {
                window.alert("key, Memoはいずれも必須です。");
                return;
            } else {
                localStorage.setItem(key, value);
                viewStorage();//localStorageからのデータ取得とテーブルへ表示
                let w_msg ="LocalStorageに" + key + " " + value + "を保存しました。";
                window.alert(w_msg);
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
            }
        } ,false
    );
};

//3.logicalStorageから1件削除
function delLocalStorage() {
    const del = document.getElementById("del");
    del.addEventListener("click",
      function(e) {
        e.preventDefault();
        let w_sel = "0";//選択されていれば、"1"が返却（へんきゃく）される
        w_sel = selectRadioBtn();//テーブルからデータ選択

        if(w_sel === "1"){
            const key = document.getElementById("textKey").value;
            const value = document.getElementById("textMemo").value;
            localStorage.removeItem(key);
            viewStorage();//localStorageからのデータ取得とテーブルへ表示
            let w_msg ="LocalStorageから" + key + " " + value + "を削除しました。";
            window.alert(w_msg);
            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
        }
      },false
    );
};

//4. localstorageからすべて削除
function allClearLocalStorage(){
    const allClear = document.getElementById("allClear");
    allClear.addEventListener("click",
        function(e) {
            e.preventDefault();
            let w_confirm = confirm("LocalStoreageのデータをすべて削除(all clear)します。\nよろしいですか？");
            //確認ダイアログで「OK」を押されたとき、すべて削除する
            if (w_confirm === true) {
                localStorage.clear();
                viewStorage();//localStorageからのデータ取得とテーブルへ表示
                let w_msg ="LocalStorageのデータをすべて削除(all clear)しました。";
                window.alert(w_msg);
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
            }
        },false
    );
};


//5.データ選択
function selectTable() {
  const select = document.getElementById("select");
  select.addEventListener("click",
    function(e) {
        e.preventDefault();
        selectRadioBtn(); //テーブルからデータ選択
    }, false
  );
};

//テーブルからデータ選択
function selectRadioBtn(){
    let w_sel = "0"; //選択されていれば、"1"にする。
    const radio1 = document.getElementsByName("radio1");
    const table1 = document.getElementById("table1");

    for(let i=0; i < radio1.length; i++){
        if(radio1[i].checked){
            document.getElementById("textKey").value = table1.rows[i+1].cells[1].firstChild.data;
            document.getElementById("textMemo").value = table1.rows[i+1].cells[2].firstChild.data;
            return w_sel ="1";
        }
    }

    window.alert("1つ選択（select）してください。")
};
//localStorageからのデータ取得とテーブルへ表示
function viewStorage() {
    const list = document.getElementById("list");
    //htemのテーブル初期化
    while(list.rows[0])list.deleteRow(0);

    //localStorageすべての情報の取得
    for(let i=0; i < localStorage.length; i++) {
        let w_key = localStorage.key(i);

        //localStorageのキーと値を表示  
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        list.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        td1.innerHTML = "<input name='radio1' type='radio'>";
        td2.innerHTML = w_key;
        td3.innerHTML = localStorage.getItem(w_key);
    }

    //jQueryのplugin tablesorterを使ってテーブルのソート
    //sortList: 引数１...最初からソートしておく例を指定、引数2...0...昇順、1...降順
    $("#table1").tablesorter({
        sortList:[[1,0]]
    });

    $("#table1").trigger("update");//tablesort
}