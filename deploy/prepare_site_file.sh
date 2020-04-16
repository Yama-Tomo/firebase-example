#!/bin/sh -e

current=$(cd $(dirname $0);pwd)
project_root=${current}/../

# htmlへのリクエストをbasic認証をかけられるように functionsと一緒にデプロイするため `functions` 配下へコピーする
app_path=${project_root}/packages/site/public
functions_dist_path=${project_root}/functions/static/site

# cleanup
rm -rf ${functions_dist_path}

cp -a ${app_path} ${functions_dist_path}
# .html 以外のファイルは削除
find ${functions_dist_path} -type f | grep -v '\.html$' | xargs rm

# html以外のリクエストはそのままhostingする
dist_path=${project_root}/dist/site

# cleanup
rm -rf ${dist_path}

cp -a ${app_path} ${dist_path}
# .html ファイルを削除
find ${dist_path} -type f | grep '\.html$' | xargs rm

