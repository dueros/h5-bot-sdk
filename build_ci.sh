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
# npm install
# npm run buildSingleFile
mkdir output
mkdir output/sdk
mkdir output/html
cp dist/* output/sdk
cp example/*.html output/html/
cd output
tar -zcf sdk.tar.gz sdk
tar -zcf html.tar.gz html
rm -rf html sdk
echo '**** CI finish ****'
