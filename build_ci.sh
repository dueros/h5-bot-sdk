#!/usr/bin/env bash

# 保证你的build.sh脚本有任何错误就退出
set -e

# 保证你的字符集正确，如果是英文写en_US.UTF-8，如果是中文写zh_CN.UTF-8
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

# 保证找到正确的Node和npm命令
export PATH=$NODEJS_BIN_LATEST:$PATH

echo '**** CI begin ****'
npm install
npm run buildSingleFile
npm run buildModule
mkdir output
mkdir output/sdk
mkdir output/html
cp -rf dist/* output/sdk
cp example/*.html output/html/
cd output
tar -zcf sdk.tar.gz sdk
tar -zcf html.tar.gz html
rm -rf html sdk

cd ../
mkdir dist
mv output/* dist/
# ----------分割线
DIR=$(cd $(dirname $0);pwd)
OUTPUT_WORKSPACE_DIR=$DIR/output/workspace
OPERA_MODULE_DIR=$OUTPUT_WORKSPACE_DIR/output
rm -rf $DIR/output
mkdir -p $OUTPUT_WORKSPACE_DIR
mkdir -p $OPERA_MODULE_DIR/package
# 下载打包工具(baidu/apaas/package-template)的最新发布版本
cd $OUTPUT_WORKSPACE_DIR && curl "http://agile.baidu.com/api/agile/getReleaseInfoOutputUrl?module=baidu/apaas/package-template" | python -m json.tool | grep outputHttpUrl | awk -F": " '{print $2}' | awk -F"," '{print $1}' | xargs -n 1 wget -O output.tar.gz --no-check-certificate --header "IREPO-TOKEN:f326c4c1-8627-4038-9950-1347fe9009e2" && tar xzvf output.tar.gz && cd output && tar xzvf opera-module.tgz && rm opera-module.tgz
# 把业务模块内容拷贝到打包模版的package目录下
cp -r $DIR/dist/* $OPERA_MODULE_DIR/package
# 打成指定包opera-module.tgz
tar zcvf $DIR/output/opera-module.tgz -C $OPERA_MODULE_DIR . --exclude build.sh --exclude output --exclude README.md --exclude BCLOUD
rm -rf $OUTPUT_WORKSPACE_DIR
rm  -rf ./dist
echo '**** CI finish ****'
