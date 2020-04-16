#!/bin/sh -e

current=$(cd $(dirname $0);pwd)
project_root=${current}/../

# htmlへのリクエストをbasic認証をかけられるように functionsと一緒にデプロイするため `functions` 配下へコピーする
app_path=${project_root}/packages/cms/build
functions_dist_path=${project_root}/functions/static/cms

# cleanup
rm -rf ${functions_dist_path}

cp -a ${app_path} ${functions_dist_path}
# .html 以外のファイルは削除
find ${functions_dist_path} -type f | grep -v '\.html$' | xargs rm

# html以外のリクエストはそのままhostingする
dist_path=${project_root}/dist/cms

# cleanup
rm -rf ${dist_path}

cp -a ${app_path} ${dist_path}
# .html ファイルを削除
find ${dist_path} -type f | grep '\.html$' | xargs rm

