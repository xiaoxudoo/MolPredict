#! /bin/bash
# @author xiaoxudoo from leike 2017-02-17
# 自动打包上传到代码仓库

echo "build start"                      # 开始构建
pack_time=$(date +%Y-%m-%d-%H-%M-%S)    # 构建时间
pack_name=build-$pack_time              # 压缩包名称

git add -A && git commit -am "$pack_name"
git pull origin master                  # 上传之前拉一次代码，有冲突解决冲突
git push origin master                  # 提交
