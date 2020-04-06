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
