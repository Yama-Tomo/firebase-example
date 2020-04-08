# firebase example

## get started

- プロジェクトルートで依存パッケージをインストールします
  ```bash
  $ yarn
  ```

- firebaseコンソールのプロジェクトを設定 ->  サービスアカウント -> FirebaseAdminSDKの新しい秘密鍵の生成

  鍵は .secrets 以下に任意の名前で保存して以下の環境変数を設定してください
  
  ```bash
  $ export GOOGLE_APPLICATION_CREDENTIALS='.secrets/service-account.json
  ```

- `firebase-tools` をローカルインストールしているので path を通す必要があります

  適宜 direnv などプロジェクトルートの node_modules/.bin の絶対パスを追加してください
  
  ```bash
  export PATH=$PATH:</your/project/root/absolute/path>/node_modules/.bin
  ```

- プロジェクトルートで `firebase login` を実行します

  ```bash
  $ firebase login
  $ firebase use --add # 複数プロジェクトを持っている場合は実行
  ```

## CI

- 以下の変数を github secrets に登録します

<details>
  <summary>登録する変数一覧</summary>
  
  |key|value|
  |---|---|
  |FIREBASE_API_KEY<br>FIREBASE_AUTH_DOMAIN<br>FIREBASE_DATABASE_URL<br>FIREBASE_PROJECT_ID<br>FIREBASE_STORAGE_BUCKET<br>FIREBASE_MESSAGING_SENDER_ID<br>FIREBASE_APP_ID<br>FIREBASE_MEASUREMENT_ID|Firebase SDK の値を設定します|
  |FIREBASE_CI_TOKEN|firebase login:ci で取得したトークンを設定します|
  |FIREBASE_RC|.firebaserc を base64 したものを設定します<br>このリポジトリでは複数の hosting を設定しています<br> `cms`, `site` というキーで設定をしてある必要があります|
  |GOOGLE_APPLICATION_CREDENTIALS|FirebaseAdminSDK の秘密鍵の json を base64 したものを設定します<br>gatsby のビルド時のデータ取得に利用されます|  
</details>


