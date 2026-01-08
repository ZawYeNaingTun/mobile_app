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
                Swal.fire({
                    title: "Memo app" //タイトルをここに設定
                  , html : "Key, Memoはいずれも必顔です。"//メッセージ内容をここに設定
                  , type : "error"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                  , allowOutsideClick : false //枠外（わくがい）クリックは許可しない
                });
                return;
            } else {
                let w_msg = "LocalStoreageに\n「"+ key + " " + value +"」\nを保存しますか？";
                Swal.fire({
                    title: "Memo app" //タイトルをここに設定
                  , html : w_msg//メッセージ内容をここに設定
                  , type : "question"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                  , showCancelButton : true //枠外（わくがい）クリックは許可しない
                }).then(function(result){
                    if (result.value === true){
                        localStorage.setItem(key, value);
                        viewStorage();//localStorageからのデータ取得とテーブルへ表示
                        let w_msg ="LocalStorageに" + key + " " + value + "を保存しました。";
                        Swal.fire({
                             title: "Memo app" //タイトルをここに設定
                            , html : w_msg
                            , type : "success"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                            , allowOutsideClick : false //枠外（わくがい）クリックは許可しない
                        });
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";
                    }
                });
            }
        },false
    );
};

//3.logicalStorageから1件削除 //version-up3 chg 一件削除　==> 選択されている行を削除
function delLocalStorage() {
    const del = document.getElementById("del");
    del.addEventListener("click",
      function(e) {
        e.preventDefault();
        const chkbox1 = document.getElementsByName("chkbox1");  //version-up3 add
        const table1 = document.getElementById("table1");       //version-up3 add
        let w_cnt = 0;//選択されていれば、"1"が返却（へんきゃく）される // version-up3 w_sel="0" ==> w_cnt=0
        w_cnt = selectCheckBox("del");//テーブルからデータ選択 // version-up3 chg 戻り値:w_sel ==> w_cnt 引数:なし==>"del"

        if(w_cnt >= 1){ ////version-up3 chg w_sel === "1" ==> w_cnt >=1
            
            let w_msg = ("LocalStoreagから選択されている" + w_cnt + "件を削除 (delete) しますか？");////version-up3 chg
            Swal.fire({
                    title: "Memo app" //タイトルをここに設定
                  , html : w_msg//メッセージ内容をここに設定
                  , type : "question"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                  , showCancelButton : true //枠外（わくがい）クリックは許可しない
                }).then(function(result){
                    if (result.value === true){
                        for(let i = 0; i < chkbox1.length; i++){//version-up3 add
                            if(chkbox1[i].checked){//version-up3 add
                                localStorage.removeItem(table1.rows[i+1].cells[1].firstChild.data);//version-up3 chg
                            } //version^up3 add
                        }//version-up3 add
                        viewStorage();//localStorageからのデータ取得とテーブルへ表示
                        let w_msg ="LocalStorageから" + w_cnt + "件を削除 (delete) しました。";//version-up3 chg
                        Swal.fire({
                             title: "Memo app" //タイトルをここに設定
                            , html : w_msg
                            , type : "success"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                            , allowOutsideClick : false //枠外（わくがい）クリックは許可しない
                        });
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = ""; 
                    }
                });
 
            }
      },false
    );
}

//4. localstorageからすべて削除
function allClearLocalStorage(){
    const allClear = document.getElementById("allClear");
    allClear.addEventListener("click",
        function(e) {
            e.preventDefault();
            
            
            let w_msg = ("LocalStoreageのデータをすべて削除(all clear)します。\nよろしいですか？");
            Swal.fire({
                    title: "Memo app" //タイトルをここに設定
                  , html : w_msg//メッセージ内容をここに設定
                  , type : "question"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                  , showCancelButton : true //枠外（わくがい）クリックは許可しない
                }).then(function(result){
                    if (result.value === true){
                        localStorage.clear();
                        viewStorage();//localStorageからのデータ取得とテーブルへ表示
                        let w_msg ="LocalStorageのデータをすべて削除(all clear)しました。";
                        Swal.fire({
                            title: "Memo app" //タイトルをここに設定
                            , html : w_msg
                            , type : "success"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
                            , allowOutsideClick : false //枠外（わくがい）クリックは許可しない
                        });
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";
                    }
                });
        },false
    );
}


//5.データ選択
function selectTable() {
  const select = document.getElementById("select");
  select.addEventListener("click",
    function(e) {
        e.preventDefault();
        selectCheckBox("select"); //テーブルからデータ選択 //version-up3 chg
    }, false
  );
}

//テーブルからデータ選択
function selectCheckBox(mode){ //version-up3 chg 引数:なし==> mode
    // let w_sel = "0"; //選択されていれば、"1"にする。//version-up3 del
    let w_cnt = 0; // 選択されているチェックボックスの数
    const chkbox1 = document.getElementsByName("chkbox1");//version-up2 chg: radio ==>chkbox1
    const table1 = document.getElementById("table1");
    let w_textKey = "";//work
    let w_textMemo = "";//work


    for(let i=0; i < chkbox1.length; i++){
        if(chkbox1[i].checked){
            if(w_cnt === 0){
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;
                //return w_sel ="1";
            }
            w_cnt++//選択されているチェックボックスの数をカウント
        }
    }

    document.getElementById("textKey").value = w_textKey;
    document.getElementById("textMemo").value = w_textMemo;

    if(mode === "select"){//version-up3 add
        if(w_cnt === 1){
            return w_cnt;//version-up3 chg w_sel = "1" ==> w_cnt
        }
        else{
            Swal.fire({
                title: "Memo app" //タイトルをここに設定
              , html : "1つ選択(select)してください。"//メッセージ内容をここに設定
              , type : "error"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
              , allowOutsideClick : false //枠外（わくがい）クリックは許可しない
            });
        }
    } //version-up3 add

    if(mode === "del"){         // version-up3 add
        if (w_cnt >= 1) {       // version-up3 add
            return w_cnt;       // version-up3 add
        }
        else {
             Swal.fire({
                title: "Memo app" //タイトルをここに設定
              , html : "1つ以上選択(select)してください。"//メッセージ内容をここに設定
              , type : "error"//ダイアログにアイコンを表示したい場合に設定する引数 warning,error,success,info,question
              , allowOutsideClick : false //枠外（わくがい）クリックは許可しない
            });
        }                       // version-up3 add
    }                           // version-up3 add  
}                               // version-up3 add


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

        td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
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
